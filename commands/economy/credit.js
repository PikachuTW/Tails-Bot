const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const { targetGet, getCredit } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;

    const res = await getCredit(target);

    const creditrank = await credit.count({ tails_credit: { $gte: res } });

    message.reply({
        embeds: [new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`${target.user.tag} 的Tails幣餘額`)
            .setDescription(`餘額: \`${res}\`\n排名: \`${creditrank - 1}\``)
            .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))],
    });
};

exports.conf = {
    aliases: ['bal'],
    permLevel: 'User',
    description: '查看你的Tails幣餘額',
};
