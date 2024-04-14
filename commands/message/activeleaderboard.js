const { MessageEmbed } = require('discord.js');
const level = require('../../models/level.js');

exports.run = async (client, message, args) => {
    let page;
    if (!args[0]) {
        page = 1;
    } else {
        page = parseInt(args[0], 10);
        if (!Number.isSafeInteger(page) || page <= 0 || page > 100) {
            return message.reply('請給予1~100的頁數範圍');
        }
    }

    const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);
    const res = await level.aggregate([
        { $unwind: '$daily' },
        { $match: { 'daily.date': { $gte: nowStamp - 2 } } },
        {
            $group: {
                _id: '$discordid',
                total: { $sum: '$daily.count' },
            },
        },
        { $sort: { total: -1 } },
    ]);

    let co = '';

    for (let i = 10 * page - 10; i < 10 * page; i++) {
        if (!res[i]) break;
        // eslint-disable-next-line no-underscore-dangle
        co += `\`${i + 1}\` <@${res[i]._id}> **${res[i].total}**\n`;
    }
    if (co === '') { co = '此排名段無資料'; }

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('三日內訊息量前十排行榜')
                .setDescription(co),
        ],
    });
};

exports.conf = {
    aliases: ['activelb'],
    permLevel: 'User',
    description: '三日訊息量排行榜',
};
