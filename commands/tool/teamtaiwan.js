const { MessageAttachment } = require('discord.js');
const { targetGet } = require('../../modules/functions');
const { Canvas } = require('../../modules/canvas.js');

exports.run = async (client, message, args) => {
    let target;
    if (args[0]) {
        target = targetGet(message, args) || await client.users.fetch(args[0]) || message.member;
    } else {
        target = message.member;
    }
    const canvas = Canvas.createCanvas(1080, 1080);
    const ctx = canvas.getContext('2d');
    let image;
    const custom = (message.attachments.size > 0 && message.attachments.first().contentType.startsWith('image'));
    if (custom) {
        image = await Canvas.loadImage(message.attachments.first().url, 0, 0, canvas.width, canvas.height);
    } else {
        image = await Canvas.loadImage(target.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }), 0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(await Canvas.loadImage(`${__dirname}/../../images/teamtaiwan2024.png`), 0, 0, canvas.width, canvas.height);

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${target.id}_avatar.png`);

    message.reply({ content: custom ? '你已經加入台灣隊!' : `${target} 你已經加入台灣隊!`, files: [attachment] });
};

exports.conf = {
    aliases: ['tt'],
    permLevel: 'User',
    description: '一起加入臺灣隊吧! 賴清德2024特效框\nhttps://twb.nz/teamtaiwan2024',
};
