exports.run = async (client, message, args) => {
    const guild = client.guilds.cache.find(guild => guild.id == '828450904990154802');
    const lockchannel = message.guild.channels.cache.find(channel => channel.id === '832219569501241385');
    const lockrole = message.guild.roles.cache.find(role => role.id === '881911118845587477') || await guild.roles.fetch('881911118845587477');
    const lockrole2 = message.guild.roles.cache.find(role => role.id === '897124893383094302') || await guild.roles.fetch('897124893383094302');
    lockchannel.permissionOverwrites.edit(lockrole, { MENTION_EVERYONE: false });
    lockchannel.permissionOverwrites.edit(lockrole2, { MENTION_EVERYONE: false });

    message.reply('已經關閉小粉紅的提及所有人權限!');
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['lp'],
    permLevel: 'Co-Owner',
};

exports.help = {
    name: 'lockping',
    category: '管理',
    description: '關閉小粉紅提及權限',
    usage: 'lockping',
};