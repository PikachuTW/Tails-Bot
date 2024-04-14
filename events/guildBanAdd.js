/* eslint-disable no-unused-vars */
// const { MessageEmbed } = require('discord.js');

module.exports = async (client, ban) => {
    // const fetchedLogs = await ban.guild.fetchAuditLogs({
    //     limit: 1,
    //     type: 'MEMBER_BAN_ADD',
    // });
    // const banLog = fetchedLogs.entries.first();

    // if (!banLog) return;
    // if (banLog.target.id !== ban.user.id) return;

    // if (['650604337000742934', '889358372170792970'].indexOf(banLog.executor.id) != -1) return;

    // const executorMember = ban.guild.members.cache.find((member) => member.id == banLog.executor.id);
    // executorMember.roles.remove(executorMember.roles.cache.filter((r) => r.id != '830689873367138304' && r.id != '864379903164284940'));

    // const resEmbed = new MessageEmbed()
    //     .setColor('#ffae00')
    //     .setTitle(`${ban.user.newName} ${ban.user.id} 已經被 ${banLog.executor.newName} ${banLog.executor.id} 禁止`)
    //     .setFooter({ text: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) });
    // client.channels.cache.find((channel) => channel.id == '941142890703360020').send({ embeds: [resEmbed] });
    // client.users.cache.find((user) => user.id == '650604337000742934').send({ embeds: [resEmbed] });
};
