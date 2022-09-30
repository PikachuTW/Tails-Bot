const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');

exports.run = async (client, message) => {
    let res = await credit.find({}).sort({ tails_credit: -1 }).limit(11);

    let co = '';

    res = res.filter((k) => k.discordid !== '650604337000742934');

    for (let i = 0; i < 10; i++) {
        co += `\`${i + 1}\` <@${res[i].discordid}> **${res[i].tails_credit}**\n`;
    }

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('Tails幣前十排行榜')
        .setDescription(co);

    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: ['lb'],
    permLevel: 'User',
    description: 'Tails幣排行榜',
};
