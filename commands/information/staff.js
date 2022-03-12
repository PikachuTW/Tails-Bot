const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {

    const all = message.guild.members.cache.filter(member => member.roles.cache.find(role => role.id === '832213672695693312'));
    const staff = all.filter(member => !member.roles.cache.find(role => role.id === '854959385901531137') && ['650604337000742934', '543678628148281355'].indexOf(member.id) == -1);
    const mod = all.filter(member => !member.roles.cache.find(role => role.id === '856377783163944970') && member.roles.cache.find(role => role.id === '854959385901531137'));
    const admin = all.filter(member => !member.roles.cache.find(role => role.id === '854957401362268162') && member.roles.cache.find(role => role.id === '856377783163944970'));
    const coowner = all.filter(member => !member.roles.cache.find(role => role.id === '926781326202388480') && !member.roles.cache.find(role => role.id === '870741338960830544') && member.roles.cache.find(role => role.id === '854957401362268162'));
    const chief = all.filter(member => member.roles.cache.find(role => role.id === '926781326202388480'));
    const owner = all.filter(member => !member.roles.cache.find(role => role.id === '952197467095572491') && member.roles.cache.find(role => role.id === '870741338960830544'));
    const top = all.filter(member => member.roles.cache.find(role => role.id === '952197467095572491'));

    const Embed1 = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('管理人員階級列表')
        .setDescription(`**TAILS的最高行政官**\n${top.size > 0 ? top.map(member => member.user).join('\n') + '\n' : '```無```\n'}**群主OWNER**\n${owner.size > 0 ? owner.map(member => member.user).join('\n') + '\n' : '```無```\n'}**行政長官CHIEF EXECUTIVE**\n${chief.size > 0 ? chief.map(member => member.user).join('\n') + '\n' : '```無```\n'}**副群主COOWNER**\n${coowner.size > 0 ? coowner.map(member => member.user).join('\n') + '\n' : '```無```\n'}**管理員ADMIN**\n${admin.size > 0 ? admin.map(member => member.user).join('\n') + '\n' : '```無```\n'}**版主MOD**\n${mod.size > 0 ? mod.map(member => member.user).join('\n') + '\n' : '```無```\n'}**管理人員STAFF**\n${staff.size > 0 ? staff.map(member => member.user).join('\n') + '\n' : '```無```\n'}`);
    message.channel.send({ embeds: [Embed1] });
};

//  && member.roles.cache.find(role => role == Role2) == undefined).map(member => member.user).join(`\n`);

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
};

exports.help = {
    name: 'staff',
    description: '回傳管理人員階級列表',
    usage: 'staff',
};