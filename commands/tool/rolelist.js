const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const roleid = args[0];
    const Role = message.guild.roles.cache.get(roleid);
    const Members = message.guild.members.cache.filter((member) => member.roles.cache.get(Role.id)).map((d) => d).join('\n');

    const Embed1 = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${Role.name} 身分組成員列表 ( ${Role.members.size} 個 )`)
        .setDescription(Members);

    message.channel.send({ embeds: [Embed1] });
};

exports.conf = {
    aliases: ['rl'],
    permLevel: 'Tails',
    description: '身分組中成員列表',
    usage: 'rolelist [身分組id]',
};
