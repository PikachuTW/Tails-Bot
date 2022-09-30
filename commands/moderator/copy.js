const { MessageEmbed } = require('discord.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');
    if (target.communicationDisabledUntilTimestamp - Date.now() > 0) return message.reply('此用戶早就已經被禁言了! :joy:');
    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以說他copy :weary:');

    target.timeout(20000, `${message.author.username}#${message.author.discriminator} - copy`);

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(`**:white_check_mark:  ${target.user.tag} 因為複製他人訊息被禁言20秒**`),
        ],
    });

    try {
        target.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(`**你因為複製別人訊息被 ${message.author.tag} 禁言20秒了＊＊`),
            ],
        });
    } catch { }
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '對於用戶copy進行處分',
};
