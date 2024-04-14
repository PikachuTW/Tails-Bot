const { MessageEmbed } = require('discord.js');
const warning = require('../../models/warning.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');

    const reason = args.slice(1).join(' ');

    if (!reason) return message.reply('請提供原因!');
    if (reason.length > 100) return message.reply('原因過長!');

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以警告他 :weary:');

    await warning.create({
        discordid: target.id,
        warnstamp: Date.now(),
        warncontent: reason,
        warnstaff: message.author.id,
    });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(`**:white_check_mark:  ${target.user.newName} 已被警告 | ${reason}**`),
        ],
    });

    try {
        target.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(`**你被 ${message.author.newName} 警告了，原因: ${reason}**`),
            ],
        });
    } catch { }
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '警告成員',
};
