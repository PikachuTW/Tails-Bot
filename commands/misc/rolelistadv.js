const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const mode = args[0];
    const roleid1 = args[1];
    const roleid2 = args[2];
    const Role1 = message.guild.roles.cache.get(roleid1);
    const Role2 = message.guild.roles.cache.get(roleid2);

    // list
    if (mode === 'list') {
        return message.reply('```& | -```');
    }

    if (mode === '1') {
        const Members = message.guild.members.cache.filter((member) => member.roles.cache.find((role) => role === Role1) && member.roles.cache.find((role) => role === Role2)).map((member) => member.user).join('\n');

        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${Role1.name} ${Role2.name} 共同身分組成員列表`)
                .setDescription(Members)],
        });
    } else if (mode === '2') {
        const Members = message.guild.members.cache.filter((member) => member.roles.cache.find((role) => role === Role1) || member.roles.cache.find((role) => role === Role2)).map((member) => member.user).join('\n');

        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${Role1.name} ${Role2.name} 共同身分組成員列表`)
                .setDescription(Members)],
        });
    } else if (mode === '3') {
        const Members = message.guild.members.cache.filter((member) => member.roles.cache.find((role) => role === Role1) && member.roles.cache.find((role) => role === Role2) === undefined).map((member) => member.user).join('\n');

        message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${Role1.name} ${Role2.name} 差集身分組成員列表`)
                .setDescription(Members)],
        });
    } else {
        message.reply('沒有給予模式');
    }
};

exports.conf = {
    aliases: ['rla'],
    permLevel: 'Highest',
    description: '兩個身分組中共同成員列表',
};
