exports.run = async (client, message) => {
    message.reply(`${new Date().toLocaleString('zh-TW', { timeZone: 'America/Montevideo' })}`);
};

exports.conf = {
    aliases: ['yoshi'],
    permLevel: 'User',
    description: 'yoshi 的目前時間 🙈',
};
