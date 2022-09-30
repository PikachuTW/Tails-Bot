const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const { targetGet } = require('../../modules/functions');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');
    const time = args[1];
    const reason = args.slice(2).join(' ');
    if (!time) return message.reply('請提供時間');
    if (!reason) return message.reply('請提供原因!');
    if (target.communicationDisabledUntilTimestamp - Date.now() > 0) return message.reply('此用戶早就已經被禁言了! :joy:');
    const milliseconds = ms(time);

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以禁言他 :weary:');

    if (!milliseconds || milliseconds < 10000 || milliseconds > 604800000) {
        return message.reply('請給出 10s-7d 的時間');
    }

    target.timeout(milliseconds, `${message.author.username}#${message.author.discriminator} - ${reason}`);

    const ReasonEmbed = new MessageEmbed()
        .setTitle('成員已被禁言!')
        .setColor('#ffae00')
        .addField('成員', `${target}`, false)
        .addField('時間', `${ms(ms(time), { long: true })}`, false)
        .addField('原因', `${reason}`, false)
        .addField('管理者', `${message.author}`, false)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({ embeds: [ReasonEmbed] });
    client.channels.cache.find((channel) => channel.id === '907969972893020201').send({ embeds: [ReasonEmbed] });

    target.send({
        embeds: [
            new MessageEmbed()
                .setTitle('你已經被禁言!')
                .setColor('#ffae00')
                .setDescription(`你被禁言了 ${ms(ms(time), { long: true })}\n原因: ${reason}\n管理者:${message.author}`)
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '禁言成員',
};
