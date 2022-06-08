exports.run = async (client, message) => {
    message.reply('https://tails.gitbook.io/rules/');
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '獲取你的頭像',
};
