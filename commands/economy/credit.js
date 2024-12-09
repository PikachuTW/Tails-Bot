const { MessageAttachment } = require('discord.js');
const creditModel = require('../../models/credit.js');
const { targetGet, getCredit } = require('../../modules/functions.js');
const { Canvas } = require('../../modules/canvas.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;
    const userCredit = await getCredit(target);
    const creditrank = await creditModel.count({ tails_credit: { $gte: userCredit } });

    const canvas = Canvas.createCanvas(650, 325);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(await Canvas.loadImage(`${__dirname}/../../images/bal.png`), 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(15, 15, 60, 60, 12.5);
    ctx.closePath();
    ctx.clip();

    const avatar = await Canvas.loadImage(target.displayAvatarURL());
    ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, 15, 15, 60, 60);

    ctx.restore();
    ctx.font = `55px ${Canvas.font}`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${target.user.newName}`, 90, 62.5, 550);

    ctx.font = `50px ${Canvas.font}`;
    ctx.textAlign = 'start';
    ctx.fillText(`${userCredit}`, 200, 162);
    ctx.fillText(`${creditrank}`, 200, 269.25, 750);

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${target.id}_tails_credit.png`);
    message.reply({ files: [attachment] });
};

exports.conf = {
    aliases: ['bal'],
    permLevel: 'User',
    description: '查看你的Tails幣餘額',
};
