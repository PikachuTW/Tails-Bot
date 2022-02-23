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
        co += `\`${i + 1}\` <@${res[i]._id}> **${res[i].total}**\n`;
    }

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('三日內訊息量前十排行榜')
        .setDescription(co)
        .setThumbnail('https://i.imgur.com/MTWQbeh.png')
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['activelb'],
    permLevel: 'User',
};

exports.help = {
    name: 'activeleaderboard',
    category: '訊息',
    description: '三日訊息量排行榜',
    usage: 'activeleaderboard',
};