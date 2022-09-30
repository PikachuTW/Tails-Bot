exports.run = async (client, message) => {
    if (!client.op || Date.now() - client.op > 30000) {
        if ((!message.member.roles.cache.has('856377783163944970') && !message.member.roles.cache.has('977598334002954260')) || message.member.roles.cache.has('881911118845587477')) return message.reply('你沒有權限使用!');
        const lockchannel = message.guild.channels.cache.get('948178858610405426');
        if (!lockchannel.permissionsFor('881911118845587477').any('MENTION_EVERYONE')) {
            lockchannel.permissionOverwrites.edit('881911118845587477', { MENTION_EVERYONE: true });
        }
        message.reply('已經開啟小粉紅的提及所有人權限!');
        // eslint-disable-next-line no-param-reassign
        client.op = Date.now();
    } else {
        message.reply(`冷卻時間 ${30 - (Date.now() - client.op) / 1000} 秒`);
    }
};

exports.conf = {
    aliases: ['op'],
    permLevel: 'User',
    description: '開啟小粉紅提及權限',
};
