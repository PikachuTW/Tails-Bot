exports.run = async (client, message) => {
    if (!message.member.roles.cache.has('856808847251734559')) return message.reply('你需要活躍成員才能使用');
    message.delete();
    const { snipeDB } = client.db;
    snipeDB.set(message.channel.id, '```已屏蔽```', 'snipemsg');
    snipeDB.set(message.channel.id, '屏蔽了🙈', 'snipetime');
    snipeDB.set(message.channel.id, undefined, 'snipeatt');
};

exports.conf = {
    aliases: ['rs', 'rsnipe', 'sr'],
    permLevel: 'User',
    description: '屏蔽Snipe訊息',
};
