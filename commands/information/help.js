const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const { container } = client;

    if (!args[0]) {
        message.reply({ embeds: [client.preload.helpEmbed] });
    } else {
        const command = args[0];
        const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));
        if (cmd) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(cmd.conf.name)
                        .setColor('#ffae00')
                        .setDescription(cmd.conf.description)
                        .addField('別名', cmd.conf.aliases.length > 0 ? cmd.conf.aliases.join(', ') : '無')
                        .addField('權限等級', cmd.conf.permLevel)
                        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/ksNkKfU.png' }),
                ],
            });
        }
    }
};

exports.conf = {
    aliases: ['h'],
    permLevel: 'User',
    description: '顯示所有指令列表',
};
