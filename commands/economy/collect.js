const { MessageAttachment } = require('discord.js');
const creditModel = require('../../models/credit.js');
const economyModel = require('../../models/economy.js');
const boostModel = require('../../models/boost.js');
const { getMulti, getCredit } = require('../../modules/functions.js');
const { Canvas } = require('../../modules/canvas.js');
const levelModel = require('../../models/level.js');

exports.run = async (client, message) => {
    const { cooldown, level } = await economyModel.findOneAndUpdate(
        { discordid: message.member.id },
        { $setOnInsert: { level: 0, cooldown: 0 } },
        { upsert: true, new: true },
    );

    const bt = await boostModel.findOne({ user: message.author.id, timestamp: { $gte: Date.now() } });
    const cd = bt && bt.type === 'TIME' ? 400000 : 600000;

    if (Date.now() - cooldown < cd) {
        const remainingTime = Math.round(((cd - Date.now() + cooldown) / 1000));
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeLeft = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
        return message.reply(`你還要再${timeLeft}才能領取!`);
    }

    await economyModel.updateOne({ discordid: message.author.id }, { $set: { cooldown: Date.now() } });

    const giveAmount = Math.floor(level ** 1.225 * await getMulti(message.member)) + 1;

    await getCredit(message.member);

    await creditModel.updateOne(
        { discordid: message.author.id },
        { $inc: { tails_credit: giveAmount } },
        { upsert: true, new: true },
    );

    const canvas = Canvas.createCanvas(750, 225);
    const ctx = canvas.getContext('2d');
    const backgroundImage = await Canvas.loadImage(`${__dirname}/../../images/collect.png`);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(10, 10, 50, 50, 12.5);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(message.member.displayAvatarURL());
    ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, 10, 10, 50, 50);
    ctx.restore();

    ctx.font = `45px ${Canvas.font}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(message.author.newName, 70, 50, 670);

    ctx.font = `88px ${Canvas.font}`;
    ctx.textAlign = 'center';
    ctx.fillText(`+${giveAmount} Tails幣`, 375, 175);

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${message.member.id}_tails_collect.png`);

    message.reply({ files: [attachment] });

    const levelData = await levelModel.findOneAndUpdate(
        { discordid: message.author.id },
        { $setOnInsert: { daily: [] } },
        { upsert: true, new: true },
    );
    const nowMS = Date.now();
    const nowStamp = Math.floor((nowMS + 28800000) / 86400000);
    const check = await levelData.daily.find((d) => d.date === nowStamp);
    if (!check) {
        await levelModel.updateOne({ discordid: message.author.id }, { $push: { daily: { date: nowStamp, count: 3 } } });
    } else {
        await levelModel.updateOne({ discordid: message.author.id, 'daily.date': nowStamp }, { $inc: { 'daily.$.count': 3 } });
    }
};

exports.conf = {
    aliases: ['c'],
    permLevel: 'User',
    description: '領取Tails幣資金',
};
