exports.run = async (client, message) => {
    if (!message.member.roles.cache.has('856377783163944970') && !message.member.roles.cache.has('977598334002954260')) return message.reply('你沒有權限使用!');
    const lockchannel = message.guild.channels.cache.get('948178858610405426');
    const lockrole = message.guild.roles.cache.get('881911118845587477');
    lockchannel.permissionOverwrites.edit(lockrole, { MENTION_EVERYONE: true });

    message.reply('已經開啟小粉紅的提及所有人權限!');
};

exports.conf = {
    aliases: ['op'],
    permLevel: 'User',
    description: '開啟小粉紅提及權限',
};
