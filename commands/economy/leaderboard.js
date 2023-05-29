const { MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');

exports.run = async (client, message) => {
    let res = await creditModel.find({}).sort({ tails_credit: -1 }).limit(12);

    res = res.filter((k) => k.discordid !== '650604337000742934');

    const top10 = res.slice(0, 10);
    const leaderboard = top10.map(({ discordid, tails_credit }, index) => `\`${index + 1}\` <@${discordid}> **${tails_credit}**`).join('\n');

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('Tails幣前十排行榜')
                .setDescription(leaderboard),
        ],
    });
};

exports.conf = {
    aliases: ['lb'],
    permLevel: 'User',
    description: 'Tails幣排行榜',
};
