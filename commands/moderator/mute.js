const { MessageAttachment } = require('discord.js');
const ms = require('ms');
const { targetGet, formatTime } = require('../../modules/functions');
const { Canvas } = require('../../modules/canvas.js');

const shortenString = (str) => (str.length > 30 ? `${str.slice(0, 30)}...` : str);

exports.run = async (client, message, [targetArg, time, ...reason]) => {
    const target = targetGet(message, [targetArg]);
    if (!target) return message.reply('請給予有效目標!');
    if (!time) return message.reply('請提供時間');
    if (!reason.length) return message.reply('請提供原因!');
    const milliseconds = ms(time);

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以禁言他 :weary:');

    if (!milliseconds || milliseconds < 10000 || milliseconds > 604800000) {
        return message.reply('請給出 10s-7d 的時間');
    }

    target.timeout(milliseconds, `${message.author.username}#${message.author.discriminator} - ${reason.join(' ')}`);

    const canvas = Canvas.createCanvas(1000, 325);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(await Canvas.loadImage(`${__dirname}/../../images/mute.png`), 0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(15, 15, 60, 60, 12.5);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(target.displayAvatarURL());
    ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, 15, 15, 60, 60);
    ctx.restore();
    ctx.font = '55px SEMIBOLD, NOTO_SANS_TC, NOTO_COLOR_EMOJI, ARIAL';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${target.user.tag}已被禁言`, 90, 60, 895);
    ctx.font = '50px SEMIBOLD, NOTO_SANS_TC, NOTO_COLOR_EMOJI, ARIAL';
    ctx.textAlign = 'center';
    ctx.fillText(`${shortenString(reason.join(' '))}`, 500, 269.25, 750);
    ctx.fillText(`${formatTime(milliseconds)}`, 292.5, 162);
    ctx.textAlign = 'start';
    ctx.fillText(`${message.author.tag}`, 615, 162, 350);

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${target.id}_tails_mute.png`);

    message.reply({ files: [attachment] });
    client.channels.cache.get('907969972893020201').send({ files: [attachment] });
    target.send({ content: `${target} 你已經被禁言`, files: [attachment] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '禁言成員',
};
