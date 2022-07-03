const { MessageEmbed } = require('discord.js');
const warning = require('../../models/warning.js');

exports.run = async (client, message) => {
    const res = await warning.aggregate([
        { $sortByCount: '$warnstaff' },
        { $limit: 10 },
    ]);

    let co = '';

    for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-underscore-dangle
        co += `\`${i + 1}\` <@${res[i]._id}> **${res[i].count}**\n`;
    }

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('管理人員執法前十排行榜')
                .setDescription(`${co}`)
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' })],
    });
};

exports.conf = {
    aliases: ['stafflb'],
    permLevel: 'User',
    description: '管理人員執法排行榜',
};
