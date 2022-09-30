const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    const list = [
        'User',
        'Staff',
        'Admin',
        'Owner',
        'Highest',
        'Tails',
    ];

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('指令列表')
        .setThumbnail('https://i.imgur.com/MTWQbeh.png')
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    list.forEach((d) => {
        let res = '';
        client.container.commands.filter((k) => k.conf.permLevel === d).forEach((value, key) => {
            res += `\`t!${key}\` `;
        });
        if (res.length === 0) {
            res = '`無`';
        }
        exampleEmbed.addField(d, res);
    });
    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: ['hp'],
    permLevel: 'User',
    description: '顯示所有指令列表',
};
