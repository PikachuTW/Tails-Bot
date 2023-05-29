const { MessageEmbed } = require('discord.js');
const economyModel = require('../../models/economy.js');
const { getMulti, targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;
    if (!target) return message.reply('請給予有效目標!');

    const { level } = await economyModel.findOneAndUpdate(
        { discordid: target.id },
        { $setOnInsert: { level: 0, cooldown: 0 } },
        { upsert: true, new: true },
    );

    const multi = (await getMulti(target) - 1) * 100;

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${target.user.tag} 的Tails幣投資系統狀態`)
                .setDescription(`# 等級 \`${level}\`\n# 出資 \`${Math.round(level ** 1.225) + 1}\` 乘數 \`+${multi.toFixed(3)}%\``)
                .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true })),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '查看你的資金投資列表',
};
