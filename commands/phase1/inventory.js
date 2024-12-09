const { MessageEmbed } = require('discord.js');
const phase1 = require('../../models/phase1.js');
const nameTable = require('../../phase1nameTable.js');

exports.run = async (client, message) => {
    const userData = await phase1.findOne({ discordid: message.author.id });
    if (!userData) {
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(
                        '**你什麼都沒有，要不要試試 t!mine iron 來獲取一些資源?**',
                    ),
            ],
        });
    }

    const response = [...nameTable.entries()]
        .filter(([key]) => userData[key])
        .map(([key, value]) => `${value} \`${userData[key]}`)
        .join('\n');

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.username} 的儲藏庫`)
                .setDescription(
                    `tails科技幣 \`${userData.money || 0}\`\n\n${response}`,
                ),
        ],
    });
};

exports.conf = {
    aliases: ['inv'],
    permLevel: 'User',
    description: 'phase1: 查看儲藏庫',
};
