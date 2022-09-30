const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    if (!message.member.roles.cache.has('856808847251734559')) return message.reply('你需要活躍成員才能使用');
    const { editSnipeDB } = client.db;

    const sdata = editSnipeDB.get(message.channel.id);
    if (!sdata) return message.reply('沒有可Snipe的訊息');

    const msg = sdata.snipemsg;
    const timeget = sdata.snipetime;
    const sender = sdata.snipesender;
    const senderatt = sdata.snipeatt;

    if (!msg && !senderatt) return message.reply('沒有可Snipe的訊息');

    const embed = new MessageEmbed()
        .setAuthor({ name: sender })
        .setDescription(`${msg}\n${senderatt ? senderatt.join(' ') : ''}`)
        .setFooter({ text: timeget })
        .setColor('F8DA07');
    if (senderatt) embed.setImage(senderatt[0]);
    message.reply({ embeds: [embed] });
};

exports.conf = {
    aliases: ['es', 's2'],
    permLevel: 'User',
    description: 'Snipe訊息',
};
