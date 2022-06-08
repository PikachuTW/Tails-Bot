const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');

exports.run = async (client, message, args) => {
    await message.delete();
    const text = args.join(' ');
    if (!text) return message.channel.send('請提供文字!');
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');
    ctx.font = '60px sans-serif';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    message.channel.send({
        files: [
            new MessageAttachment(canvas.toBuffer('image/png'), 'png.png'),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '文字轉圖片',
};
