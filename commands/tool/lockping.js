exports.run = async (client, message) => {
    const lockchannel = message.guild.channels.cache.find((channel) => channel.id === '948178858610405426');
    const lockrole = message.guild.roles.cache.find((role) => role.id === '881911118845587477');
    const lockrole2 = message.guild.roles.cache.find((role) => role.id === '897124893383094302');
    lockchannel.permissionOverwrites.edit(lockrole, { MENTION_EVERYONE: false });
    lockchannel.permissionOverwrites.edit(lockrole2, { MENTION_EVERYONE: false });

    message.reply('已經關閉小粉紅的提及所有人權限!');
};

exports.conf = {
    aliases: ['lp'],
    permLevel: 'Co-Owner',
    description: '關閉小粉紅提及權限',
    usage: 'lockping',
};
