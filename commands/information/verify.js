const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {

    if (message.member.roles.cache.has('931777599544361023')) {
        const exampleEmbed2 = new MessageEmbed()
            .setColor('GREEN')
            .setTitle(':white_check_mark: 你已經驗證過了!');
        return message.reply({ embeds: [exampleEmbed2] });
    }

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('驗證系統')
        .setThumbnail('https://i.imgur.com/MTWQbeh.png')
        .setDescription('[點我驗證](https://tails-verify.pikatest.repl.co/verify/)')
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['verified'],
    permLevel: 'User',
};

exports.help = {
    name: 'verify',
    category: '資訊',
    description: '驗證',
    usage: 'verify',
};