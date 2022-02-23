const { MessageEmbed } = require('discord.js');
const warning = require('../../models/warning.js');

exports.run = async (client, message, args) => {

    const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[0]);
    if (!target) return message.reply('請指定你要清除警告的用戶!');

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0 && ['650604337000742934', '917380616725594132'].indexOf(message.author.id) == -1) return message.reply('你的身分組沒有比他高欸!你怎麼可以幫他清除警告呢 :weary:');

    const replyamount = await warning.deleteMany({
        discordid: target.id,
    });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(`**:white_check_mark:  ${target.user.tag} 已被清除 ${replyamount.deletedCount} 項警告**`),
        ],
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Xi',
};

exports.help = {
    name: 'clearwarn',
    category: '管理',
    description: '清除成員的警告',
    usage: 'clearwarn',
};