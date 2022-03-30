const { MessageEmbed } = require('discord.js');
const economy = require('../../models/economy.js');

exports.run = async (client, message, args) => {

    const target = client.fn.targetGet(message, args) || message.member;
    if (!target) return message.reply('請給予有效目標!');

    let data = await economy.findOne({ discordid: target.id });
    if (!data) {
        data = await economy.create({
            discordid: target.id,
            level: 0,
            cooldown: 0,
        });
    }

    const nowLevel = data.level;

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${target.user.tag} 的Tails幣投資系統狀態`)
                .setDescription(`等級 \`${nowLevel}\` 出資 \`${Math.round(Math.pow(nowLevel, 1.225))}\``)
                .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'invest',
    description: '查看你的資金投資列表',
    usage: 'invest',
};