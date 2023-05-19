const { MessageEmbed, MessageAttachment } = require('discord.js');
const level = require('../../models/level.js');
const { targetGet } = require('../../modules/functions.js');
const { Canvas } = require('../../modules/canvas.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;

    const levelData = await level.findOne({ discordid: target.id });
    if (!levelData || !levelData.daily || levelData.daily.length === 0) {
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${target.user.tag} 的訊息資料`)
                    .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setDescription('```無訊息資料```')
                    .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
            ],
        });
    } else {
        const { daily } = levelData;
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);
        const total = daily.reduce((sum, d) => sum + d.count, 1);
        const weekData = daily.filter((d) => d.date >= nowStamp - 6);
        const week = weekData.reduce((sum, d) => sum + d.count, 0);
        const sActive = weekData.filter((d) => d.date >= nowStamp - 1).reduce((sum, d) => sum + d.count, 0);
        const active = weekData.filter((d) => d.date >= nowStamp - 2).reduce((sum, d) => sum + d.count, 0);
        const today = daily.find((d) => d.date === nowStamp)?.count || 0;

        const rankRes = await level.aggregate([
            { $unwind: '$daily' },
            {
                $group: {
                    _id: '$discordid',
                    total: { $sum: '$daily.count' },
                },
            },
            { $sort: { total: -1 } },
        ]);

        let msg = '';
        let ratio = 0;
        if (sActive >= 150) {
            ratio = 1;
            msg = `三天訊息量${active}則(${Math.round((active / 3) * 20) / 10}%)`;
        } else if (active >= 150) {
            ratio = sActive / 150;
            msg = `下一個目標:超級活躍(${Math.round(ratio * 1000) / 10}%)`;
        } else if (active >= 60) {
            ratio = active / 150;
            msg = `下一個目標:中等活躍(${Math.round(ratio * 1000) / 10}%)`;
        } else {
            ratio = active / 60;
            msg = `下一個目標:活躍成員(${Math.round(ratio * 1000) / 10}%)`;
        }

        const canvas = Canvas.createCanvas(1240, 750);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(await Canvas.loadImage(`${__dirname}/../../images/rank.png`), 0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(20, 20, 100, 100, 25);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(target.displayAvatarURL());
        ctx.drawImage(avatar, 0, 0, avatar.width, avatar.height, 20, 20, 100, 100);
        ctx.restore();
        ctx.font = '100px SEMIBOLD, NOTO_SANS_TC, NOTO_COLOR_EMOJI, ARIAL';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(target.user.tag, 140, 105, 1075);
        ctx.textAlign = 'center';
        ctx.font = '70px GG_SANS_MEDIUM, NOTO_SANS_TC';
        const y = 287.5;
        ctx.fillText(`${today}`, 420, y);
        ctx.fillText(`${sActive}`, 420, y + 107.5);
        ctx.fillText(`${active}`, 420, y + 107.5 * 2);
        ctx.fillText(`${week}`, 420 + 592.5, y);
        ctx.fillText(`${total}`, 420 + 592.5, y + 107.5);
        ctx.fillText(`${rankRes.filter((d) => d.total >= total).length + 1}`, 420 + 592.5, y + 107.5 * 2);
        ctx.fillStyle = '#82FF53';
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(35, 575, 1170, 140, 15);
        ctx.closePath();
        ctx.clip();
        ctx.fillRect(35, 575, 1170 * ratio, 140);
        ctx.restore();
        ctx.fillStyle = '#000000';
        ctx.fillText(msg, 620, 673);

        const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${target.id}_tails_rank.png`);

        message.reply({ files: [attachment] });
    }
};

exports.conf = {
    aliases: ['rank', 'r'],
    permLevel: 'User',
    description: '獲取你的訊息量',
};
