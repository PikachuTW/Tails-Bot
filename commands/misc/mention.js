const { MessageEmbed } = require('discord.js');

const ROLES = [
    '1361369324551409797',
    '1229073424693989427',
    '1145718480025440318',
];

exports.run = async (client, message, args) => {
    const helpEmbed = new MessageEmbed()
        .setTitle('提及擁有相同身份組的用戶')
        .setDescription(`請提供身份組名稱\n\n${ROLES.map((role) => `<@&${role}>`).join('\n')}`);
    if (args.length < 1) return message.reply({ embeds: [helpEmbed] });
    const roles = message.guild.roles.cache.filter((r) => ROLES.includes(r.id) && r.name.includes(args.join(' ')));
    if (!roles || roles.size < 1) return message.reply('找不到身份組');
    if (roles.size > 1) return message.reply('請提供唯一身份組名稱');
    const role = roles.first();
    if (!message.member.roles.cache.has(role.id)) return message.reply('你沒有這個身份組');
    if (role.members.size <= 100) {
        message.reply(`${message.member}: <@&${role.id}>`);
    } else {
        message.reply('You can\'t mention this role');
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '提及擁有相同身份組的用戶',
};
