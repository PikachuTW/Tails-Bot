const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    const all = message.guild.members.cache.filter((member) => member.roles.cache.find((role) => role.id === '832213672695693312'));
    const staff = all.filter((member) => !member.roles.cache.find((role) => role.id === '856377783163944970' || role.id === '870741338960830544'));
    const admin = all.filter((member) => !member.roles.cache.find((role) => role.id === '870741338960830544') && member.roles.cache.find((role) => role.id === '856377783163944970'));
    const owner = all.filter((member) => member.roles.cache.find((role) => role.id === '870741338960830544'));

    message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('管理人員階級列表')
                .setDescription(`**群主OWNER**\n${owner.size > 0 ? `${owner.map((member) => member.user).join('\n')}\n` : '```無```\n'}**管理員ADMIN**\n${admin.size > 0 ? `${admin.map((member) => member.user).join('\n')}\n` : '```無```\n'}**管理人員STAFF**\n${staff.size > 0 ? `${staff.map((member) => member.user).join('\n')}\n` : '```無```\n'}`)],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
};

exports.help = {
    description: '回傳管理人員階級列表',
    usage: 'staff',
};
