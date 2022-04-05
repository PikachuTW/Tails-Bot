exports.run = async (client, message, args) => {
    if (!args[0] || Number.isNaN(args[0])) return message.reply('請輸入有效訊息數!');
    const times = Math.floor((parseInt(args[0], 10) + 1) / 100);
    const left = (parseInt(args[0], 10) + 1) % 100;
    for (let i = 0; i < times; i++) {
        message.channel.bulkDelete(100);
    }
    message.channel.bulkDelete(left);
    message.channel.send(`我已經屏蔽了${parseInt(args[0], 10)}則訊息!`);
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '屏蔽許多訊息',
    usage: 'clear',
};
