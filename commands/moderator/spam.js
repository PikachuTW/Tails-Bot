const { MessageEmbed } = require('discord.js');
const warning = require('../../models/warning.js');

exports.run = async (client, message, args) => {
    const target = message.mentions.members.first() || message.guild.members.cache.find((member) => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');
    if (target.communicationDisabledUntilTimestamp - Date.now() > 0) return message.reply('此用戶早就已經被禁言了! :joy:');
    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以說他spam :weary:');

    await warning.create({
        discordid: target.id,
        warnstamp: Date.now(),
        warncontent: 'spam',
        warnstaff: message.author.id,
    });

    target.timeout(60000, `${message.author.username}#${message.author.discriminator} - spam`);

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(`**:white_check_mark:  ${target.user.tag} 已被警告+禁言一分鐘 | spam**`),
        ],
    });

    try {
        target.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(`**你被 ${message.author.tag} 警告+禁言一分鐘了，原因: spam**`),
            ],
        });
    } catch { }
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '對於用戶spam進行處分',
};
