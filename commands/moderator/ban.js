const { MessageEmbed } = require('discord.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);

    const reason = args.slice(1).join(' ');
    if (!reason) return message.reply('請提供禁止的原因');

    if (!target) {
        const res = message.guild.bans.create(args[0], { reason: `${message.author.newName} - ${reason} (ban)` });
        if (!res) {
            return message.reply('請給予有效目標!');
        }
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('成員已被禁止!')
                    .setColor('#ffae00')
                    .addFields([
                        { name: '成員', value: `<@${args[0]}>`, inline: false },
                        { name: '原因', value: `${reason}`, inline: false },
                        { name: '管理者', value: `${message.author}`, inline: false },
                    ])
                    .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
            ],
        });
    }

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
        return message.reply('你的身分組沒有比他高欸!你怎麼可以禁止他 :weary:');
    }
    if (target.roles.cache.has('881911118845587477')) {
        return message.reply('你怎麼會認為你能禁止吉祥物呢?');
    }
    if (!target.bannable) return message.reply('我無法禁止這位用戶');

    const banEmbed = new MessageEmbed()
        .setTitle('你已經被禁止於林天天伺服器!')
        .setColor('#ffae00')
        .setDescription(`原因: ${reason}\n若你想要回來，可以[點擊我](https://docs.google.com/forms/d/e/1FAIpQLSccxnNQ10-foqxaXURJqKIzQp1bzHUzGkgO3yp-l7Uc-2-3RA/viewform?usp=sf_link)來進行申訴`)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    const reasonEmbed = new MessageEmbed()
        .setTitle('成員已被禁止!')
        .setColor('#ffae00')
        .addFields([
            { name: '成員', value: `${target}`, inline: false },
            { name: '原因', value: `${reason}`, inline: false },
            { name: '管理者', value: `${message.author}`, inline: false },
        ])
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [reasonEmbed] });
    try {
        await target.send({ embeds: [banEmbed] });
    } catch (e) {
        message.reply('機器人無法私訊此用戶');
    }
    target.ban({ days: 0, reason: `${message.author.newName} - ${reason}` });
    client.channels.cache.find((channel) => channel.id === '936299386990919772').send({ embeds: [reasonEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Admin',
    description: '禁止成員',
};
