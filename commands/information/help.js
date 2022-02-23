const { codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { permlevel } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const level = permlevel(message);
    const { container } = client;

    if (!args[0]) {
        const exampleEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle('指令列表')
            .setThumbnail('https://i.imgur.com/MTWQbeh.png')
            .addField('**管理**', '`t!mute` `t!unmute` `t!kick` `t!ban` `t!softban` `t!demote` `t!nickname` `t!openping` `t!lockping` `t!clear` `t!warn` `t!warnings` `t!role` `t!megaclear`')
            .addField('系統', '`t!eval` `t!reload` `t!shutdown` `t!sync`')
            .addField('訊息', '`t!send` `t!snipe` `t!rsnipe` `t!rank` `t!msglb` `t!activelb`')
            .addField('工具', '`t!tw` `t!hk` `t!rob` `t!math`')
            .addField('Tails幣', '`t!bal` `t!add` `t!bet` `t!give` `t!invest` `t!collect` `t!buy` `t!lb` `t!redeem` `t!redeem-reverse` `t!totem` `t!gacha`')
            .addField('資訊', '`t!help` `t!key` `t!permlevel` `t!rolelist` `t!rolelist2` `t!youtube` `t!verify` `t!whois` `t!introedit` `t!staff` `t!ping`')
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
        message.reply({ embeds: [exampleEmbed] });
    }
    else {
        let command = args[0];
        if (container.commands.has(command)) {
            command = container.commands.get(command);
            if (level < container.levelCache[command.conf.permLevel]) return;
            message.channel.send(codeBlock('asciidoc', `= ${command.help.name} = \n${command.help.description}\n用法:: ${command.help.usage}\n別名:: ${command.conf.aliases.join(', ')}`));
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['h'],
    permLevel: 'User',
};

exports.help = {
    name: 'help',
    category: '資訊',
    description: '顯示所有指令列表',
    usage: 'help',
};