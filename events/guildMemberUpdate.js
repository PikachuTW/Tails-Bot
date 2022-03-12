/* eslint-disable no-unused-vars */
const { MessageEmbed } = require('discord.js');

module.exports = async (client, oldMember, newMember) => {
    // const fetchedLogs = await newMember.guild.fetchAuditLogs({
    //     limit: 1,
    //     type: 'MEMBER_UPDATE',
    // });
    // const Log = fetchedLogs.entries.first();

    // if (['650604337000742934', '889358372170792970'].indexOf(Log.executor.id) != -1) return;

    // if (!Log) return;
    // if (Log.target.id != newMember.id) return;
    // if (oldMember.nickname != newMember.nickname) return;
    // if (oldMember.communicationDisabledUntilTimestamp == newMember.communicationDisabledUntilTimestamp) return;

    // const executorMember = newMember.guild.members.cache.find(member => member.id == Log.executor.id);
    // executorMember.roles.remove(executorMember.roles.cache.filter(r => r.id != '830689873367138304' && r.id != '864379903164284940' && r.id != '872493084502523935'));

    // const resEmbed = new MessageEmbed()
    //     .setColor('#ffae00')
    //     .setTitle(`${newMember.user.tag} ${newMember.user.id} 已經被 ${Log.executor.tag} ${Log.executor.id} 進行非法操作，已經移除所有身分組`)
    //     .setFooter({ text: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) });
    // client.channels.cache.find(channel => channel.id == '948178858610405426').send({ embeds: [resEmbed] });
    // client.users.cache.find(user => user.id == '650604337000742934').send({ embeds: [resEmbed] });
};