exports.run = async (client, message, args) => {
    if (!args[0] || isNaN(args[0])) return message.reply('請輸入有效訊息數!');
    if (parseInt(args[0]) > 99) return message.reply('你不能刪除多於99則訊息!');
    if (parseInt(args[0]) < 1) return message.reply('你至少要刪除1則訊息!');
    await message.channel.messages.fetch({ limit: parseInt(args[0]) + 1 }).then(messages => {
        message.channel.bulkDelete(messages);
    });
    message.channel.send(`我已經屏蔽了${parseInt(args[0])}則訊息!`);
};

exports.conf = {
    aliases: ['c', 'purge'],
    permLevel: 'Owner',
};

exports.help = {
    name: 'clear',
    description: '屏蔽訊息',
    usage: 'clear',
};