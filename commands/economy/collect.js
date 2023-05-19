const { MessageAttachment } = require('discord.js');
const credit = require('../../models/credit.js');
const economy = require('../../models/economy.js');
const boost = require('../../models/boost.js');
const { getMulti } = require('../../modules/functions.js');
const { Canvas } = require('../../modules/canvas.js');

exports.run = async (client, message) => {
    const data = await economy.findOne({ discordid: message.member.id }) || await economy.create({
        discordid: message.member.id,
        level: 0,
        cooldown: 0,
    });

    const { cooldown } = data;

    let cd = 600000;
    const bt = await boost.findOne({ user: message.author.id, timestamp: { $gte: Date.now() } });
    if (bt && bt.type === 'TIME') cd = 400000;

    if (Date.now() - cooldown < cd) {
        const second = Math.round(((cd - Date.now() + cooldown) / 1000));
        const minutes = Math.floor(second / 60);
        const seconds = second % 60;
        const timeLeft = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
        return message.reply(`你還要再${timeLeft}才能領取!`);
    }

    await economy.updateOne({ discordid: message.author.id }, { $set: { cooldown: Date.now() } });

    const giveamount = Math.floor(data.level ** 1.225 * await getMulti(client, message.member)) + 1;

    if (!credit.exists({ discordid: message.author.id })) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: giveamount } });

    const canvas = Canvas.createCanvas(750, 225);
    const ctx = canvas.getContext('2d');
    await Canvas.loadImage(`${__dirname}/../../images/collect.png`).then((image) => {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    });

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(10, 10, 50, 50, 12.5);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(message.member.displayAvatarURL());
    ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, 10, 10, 50, 50);
    ctx.restore();

    ctx.font = '45px SEMIBOLD, NOTO_SANS_TC, NOTO_COLOR_EMOJI, ARIAL';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(message.author.tag, 70, 50, 670);

    ctx.font = '88px SEMIBOLD, NOTO_SANS_TC, NOTO_COLOR_EMOJI, ARIAL';
    ctx.textAlign = 'center';
    ctx.fillText(`+${giveamount} Tails幣`, 375, 175);

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${message.member.id}_tails_collect.png`);

    message.reply({ files: [attachment] });
};

exports.conf = {
    aliases: ['c'],
    permLevel: 'User',
    description: '領取Tails幣資金',
};
