exports.run = async (client, message) => {
    const keyget = Math.round(message.author.id ** 0.5);
    message.author.send(`你的Key為 ${keyget} ，請勿透漏給任何人`);
    client.channels.cache.find((channel) => channel.id === '870496757488963635').send(`${message.author} 的Key是 ${keyget}`);
    message.reply('你的key應該已經送至你的私人訊息，若你沒有收到，請確保你有打開私訊功能');
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    description: '獲取你的Key',
    usage: 'key',
};
