const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    const all = message.guild.roles.resolve('832213672695693312').members;
    const staff = all.filter((member) => !member.roles.cache.has('856377783163944970') && !member.roles.cache.has('870741338960830544'));
    const admin = all.filter((member) => !member.roles.cache.has('870741338960830544') && member.roles.cache.has('856377783163944970'));
    const owner = all.filter((member) => !member.roles.cache.has('872356312296591400') && member.roles.cache.has('870741338960830544'));
    const top = all.filter((member) => member.roles.cache.find((role) => role.id === '872356312296591400'));

    top.set('650604337000742934', message.guild.members.cache.get('650604337000742934'));

    const na = all.filter((m) => !m.roles.cache.has('856808847251734559'));

    message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('管理人員階級列表')
                .setDescription(`**最高權限 TOP PERM**\n${top.size > 0 ? `${top.map((k) => k).join('\n')}\n` : '```無```\n'}**管理員 ADMINISTRATOR**\n${owner.size > 0 ? `${owner.map((k) => k).join('\n')}\n` : '```無```\n'}**版主 MODERATOR**\n${admin.size > 0 ? `${admin.map((k) => k).join('\n')}\n` : '```無```\n'}**管理助手 STAFF**\n${staff.size > 0 ? `${staff.map((k) => k).join('\n')}\n` : '```無```\n'}${na.size > 0 ? `**⚠️注意，以下管理人員並沒有活躍成員⚠️**\n${na.map((k) => k).join('\n')}` : ''}`)],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '回傳管理人員階級列表',
};
