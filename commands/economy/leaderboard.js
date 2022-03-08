const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');

exports.run = async (client, message) => {

    const res = await credit.find({}).sort({ tails_credit: -1 }).limit(10);

    let co = '';

    for (let i = 0; i < 10; i++) {
        co += `\`${i + 1}\` <@${res[i].discordid}> **${res[i].tails_credit}**\n`;
    }

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('Tails幣前十排行榜')
        .setDescription(co)
        .setThumbnail('https://i.imgur.com/MTWQbeh.png')
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: ['lb'],
    permLevel: 'User',
};

exports.help = {
    name: 'leaderboard',
    description: 'Tails幣排行榜',
    usage: 'leaderboard',
};