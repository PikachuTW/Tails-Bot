exports.run = async (client, message) => {
    const lockchannel = message.guild.channels.cache.find(channel => channel.id === '948178858610405426');
    const lockrole = message.guild.roles.cache.find(role => role.id === '881911118845587477');
    lockchannel.permissionOverwrites.edit(lockrole, { MENTION_EVERYONE: true });

    message.reply('已經開啟小粉紅的提及所有人權限!');
};

exports.conf = {
    aliases: ['op'],
    permLevel: 'Co-Owner',
};

exports.help = {
    name: 'openping',
    description: '開啟小粉紅提及權限',
    usage: 'openping',
};