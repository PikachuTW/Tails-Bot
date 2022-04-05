const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const { permlevel } = require('../../modules/functions.js');
const logger = require('../../modules/Logger.js');

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
        folders.forEach((folder) => {
            const cmds = readdirSync(`./commands/${folder}/`).filter((file) => file.endsWith('.js'));
            let res = '';
            cmds.forEach((file) => {
                try {
                    res += `\`t!${file.split('.')[0]}\` `;
                } catch (error) {
                    logger.log(`${error}`, 'error');
                }
            });
            exampleEmbed.addField(`${list.get(folder)}`, res);
        });
        message.reply({ embeds: [exampleEmbed] });
    } else {
        let command = args[0];
        if (container.commands.has(command)) {
            command = container.commands.get(command);
            if (level < container.levelCache[command.conf.permLevel]) return;
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle(command.conf.name)
                        .setColor('#ffae00')
                        .setDescription(command.conf.description)
                        .addFields([
                            { name: '用法', value: command.conf.usage ? command.conf.usage : '無' },
                            { name: '別名', value: command.conf.aliases.length > 0 ? command.conf.aliases.join(', ') : '無' },
                        ])
                        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
                ],
            });
        }
    }
};

exports.conf = {
    aliases: ['h'],
    permLevel: 'User',
    description: '顯示所有指令列表',
    usage: 'help',
};
