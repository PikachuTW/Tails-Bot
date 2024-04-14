const { MessageAttachment } = require('discord.js');
const { Canvas } = require('../../modules/canvas.js');

const drawRoundRect = (ctx, x, y, width, height, radius) => {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    ctx.fillRect(x, y, width * 2, height);
    ctx.restore();
};

exports.run = async (client, message) => {
    const canvaWidth = 2000;
    const canvaHeight = 3500;
    const canvas = Canvas.createCanvas(canvaWidth, canvaHeight);
    const ctx = canvas.getContext('2d');

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 50;

    ctx.fillStyle = '#00FFD1';
    drawRoundRect(ctx, 50, 50, canvaWidth - 50 * 2, 500, 50);

    ctx.fillStyle = '#000000';
    ctx.font = `350px ${Canvas.font}`;
    ctx.fillText('每日任務', canvaWidth / 2, 50 + 250);

    ctx.fillStyle = '#FFA200';
    drawRoundRect(ctx, 50, 600, canvaWidth - 50 * 2, 750, 50);

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${message.member.id}_mission.png`);
    message.reply({ files: [attachment] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '你好',
};
