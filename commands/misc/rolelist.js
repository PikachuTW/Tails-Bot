const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const roleid = args[0];
    const Role = message.guild.roles.cache.get(roleid);

    message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${Role.name} 身分組成員列表 ( ${Role.members.size} 個 )`)
                .setDescription(Role.members.map((d) => d).join(' ')),
        ],
    });
};

exports.conf = {
    aliases: ['rl'],
    permLevel: 'Highest',
    description: '身分組中成員列表',
};
