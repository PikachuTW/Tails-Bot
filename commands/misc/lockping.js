exports.run = async (client, message) => {
    const lockchannel = message.guild.channels.cache.get('948178858610405426');
    const lockrole = message.guild.roles.cache.get('881911118845587477');
    lockchannel.permissionOverwrites.edit(lockrole, { MENTION_EVERYONE: false });

    message.reply('已經關閉小粉紅的提及所有人權限!');
};

exports.conf = {
    aliases: ['lp'],
    permLevel: 'Staff',
    description: '關閉小粉紅提及權限',
};
