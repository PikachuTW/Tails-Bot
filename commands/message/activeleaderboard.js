const { MessageEmbed } = require('discord.js');
const level = require('../../models/level.js');

exports.run = async (client, message) => {
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
        { $limit: 10 },
    ]);

    let co = '';

    for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-underscore-dangle
        co += `\`${i + 1}\` <@${res[i]._id}> **${res[i].total}**\n`;
    }

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('三日內訊息量前十排行榜')
        .setDescription(co);

    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: ['activelb'],
    permLevel: 'User',
    description: '三日訊息量排行榜',
};
