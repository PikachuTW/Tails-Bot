const { MessageEmbed } = require('discord.js');
const { targetGet } = require('../../modules/functions');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');
    const reason = args.slice(1).join(' ');
    if (!reason) return message.reply('請提供踢出的原因');

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) {
        return message.reply('你的身分組沒有比他高欸!你怎麼可以踢他 :weary:');
    }

    if (target.roles.cache.has('881911118845587477')) {
        return message.reply('你怎麼會認為你能踢出吉祥物呢?');
    }

    if (!target.bannable) return message.reply('我無法踢出這位用戶');
    const kickEmbed = new MessageEmbed()
        .setTitle('你已經被踢出林天天伺服器!')
        .setColor('#ffae00')
        .setDescription(`原因: ${reason}\n若你想要回來，可以點擊邀請連結 https://discord.gg/HswZaneNjQ`)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    const reasonEmbed = new MessageEmbed()
        .setTitle('成員已被踢出!')
        .setColor('#ffae00')
        .addFields([
            { name: '成員', value: `${target}`, inline: false },
            { name: '原因', value: `${reason}`, inline: false },
            { name: '管理者', value: `${message.author}`, inline: false },
        ])
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({ embeds: [reasonEmbed] });
    client.channels.resolve('936299461779542086').send({ embeds: [reasonEmbed] });
    await target.send({ embeds: [kickEmbed] });
    target.ban({ days: 7, reason: `${message.author.newName} - ${reason} (softban)` });
    message.guild.members.unban(target.id);
};

exports.conf = {
    aliases: [],
    permLevel: 'Admin',
    description: '踢出成員+屏蔽所有消息',
};
