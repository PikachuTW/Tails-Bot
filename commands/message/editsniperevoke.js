exports.run = async (client, message) => {
    if (!message.member.roles.cache.has('856808847251734559')) return message.reply('你需要活躍成員才能使用');
    message.delete();
    const { editSnipeDB } = client.db;
    editSnipeDB.set(message.channel.id, '```已屏蔽```', 'snipemsg');
    editSnipeDB.set(message.channel.id, '屏蔽了🙈', 'snipetime');
    editSnipeDB.set(message.channel.id, undefined, 'snipeatt');
};

exports.conf = {
    aliases: ['ers', 'esr', 'ersnipe', 'rs2'],
    permLevel: 'User',
    description: '屏蔽Snipe訊息',
};
