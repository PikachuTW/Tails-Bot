const { codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { permlevel } = require('../../modules/functions.js');
const logger = require('../../modules/Logger.js');
const { readdirSync } = require('fs');

exports.run = async (client, message, args) => {
    const level = permlevel(message.member);
    const { container } = client;

    if (!args[0]) {

        const list = new Map([
            ['economy', '經濟'],
            ['information', '資訊'],
            ['message', '訊息'],
            ['moderator', '管理'],
            ['music', '音樂'],
            ['system', '系統'],
            ['tool', '工具'],
        ]);

        const exampleEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle('指令列表')
            .setThumbnail('https://i.imgur.com/MTWQbeh.png')
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        const folders = readdirSync('./commands/');
        for (const folder of folders) {
            const cmds = readdirSync(`./commands/${folder}/`).filter(file => file.endsWith('.js'));
            let res = '';
            for (const file of cmds) {
                try {
                    const code = require(`../${folder}/${file}`);
                    res += `\`t!${code.help.name}\` `;
                }
                catch (error) {
                    logger.log(`${error}`, 'error');
                }
            }
            exampleEmbed.addField(`${list.get(folder)}`, res);
        }
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
    description: '顯示所有指令列表',
    usage: 'help',
};