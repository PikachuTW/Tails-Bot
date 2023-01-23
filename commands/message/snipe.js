const { MessageEmbed } = require('discord.js');
const snipe = require('../../models/snipe.js');

exports.run = async (client, message) => {
    if (!message.member.roles.cache.has('856808847251734559')) return message.reply('你需要活躍成員才能使用');

    const sdata = await snipe.findOne({ channelid: message.channel.id });
    if (!sdata) return message.reply('沒有可Snipe的訊息');

    const {
        snipemsg, snipetime, snipesender, snipeatt,
    } = sdata;

    if (!snipemsg && !snipeatt) return message.reply('沒有可Snipe的訊息');

    const embed = new MessageEmbed()
        .setAuthor({ name: snipesender })
        .setDescription(`${snipemsg}\n${snipeatt ? snipeatt.join(' ') : ''}`)
        .setFooter({ text: snipetime })
        .setColor('F8DA07');
    if (snipeatt) embed.setImage(snipeatt[0]);
    message.reply({ embeds: [embed] });
};

exports.conf = {
    aliases: ['s'],
    permLevel: 'User',
    description: 'Snipe訊息',
};
