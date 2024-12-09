const { MessageEmbed } = require('discord.js');
const introduction = require('../../models/introduction.js');

exports.run = async (client, message, args) => {
    const got = (await import('got')).default;
    const target = message.mentions.members.first() || message.guild.members.cache.find((member) => member.id === args[0]) || message.member;
    if (!target) return message.reply('請給予有效目標!');

    const perm = [
        ['ADMINISTRATOR', '管理者'],
        ['MANAGE_GUILD', '管理伺服器'],
        ['KICK_MEMBERS', '踢出成員'],
        ['BAN_MEMBERS', '對成員停權'],
        ['MODERATE_MEMBERS', '禁言成員'],
        ['MANAGE_CHANNELS', '管理頻道'],
        ['VIEW_AUDIT_LOG', '查看審核紀錄'],
        ['MANAGE_MESSAGES', '管理訊息'],
        ['MENTION_EVERYONE', '提及所有人'],
        ['MANAGE_NICKNAMES', '管理暱稱'],
        ['MANAGE_ROLES', '管理身分組'],
        ['MANAGE_WEBHOOKS', '管理Webhooks'],
        ['MANAGE_EMOJIS_AND_STICKERS', '管理表情符號'],
        ['MANAGE_EVENTS', '管理活動'],
        ['VIEW_GUILD_INSIGHTS', '檢視伺服器數據'],
        ['MANAGE_THREADS', '管理討論串'],
    ];

    const introdata = await introduction.findOne({ discordid: target.id });

    let banner;

    const targetUser = await target.user.fetch();
    if (targetUser.banner) {
        const res = await got.head(`https://cdn.discordapp.com/banners/${target.id}/${targetUser.banner}`);
        banner = `https://cdn.discordapp.com/banners/${target.id}/${targetUser.banner}.${res.headers['content-type'].slice(6)}?size=4096`;
    }

    message.reply({
        embeds: [
            new MessageEmbed()
                .setAuthor({ name: target.user.username, iconURL: target.displayAvatarURL({ format: 'png', dynamic: true }) })
                .setColor('#ffae00')
                .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                .setImage(banner)
                .setDescription(`<@${target.id}>\n**加入日期:** <t:${Math.round(target.joinedTimestamp / 1000)}> <t:${Math.round(target.joinedTimestamp / 1000)}:R>\n**創建日期:** <t:${Math.round(target.user.createdTimestamp / 1000)}> <t:${Math.round(target.user.createdTimestamp / 1000)}:R>\n**自我介紹:** \`${!introdata ? '無' : introdata.intro}\``)
                .addField('重要伺服器權限', `\`${perm.filter((d) => target.permissions.has(d[0])).map((d) => d[1]).join('` `') || '無'}\``)
                .addField(`身分組 [${target.roles.cache.filter((roles) => roles.id !== message.guild.id).size}]`, `${target.roles.cache.filter((roles) => roles.id !== message.guild.id).sort((a, b) => b.rawPosition - a.rawPosition).map((role) => role.toString()).join('')}`.slice(0, 1024))
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' })],
    });
};

exports.conf = {
    aliases: ['profile'],
    permLevel: 'User',
    description: '獲取成員的數據',
};
