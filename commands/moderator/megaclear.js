exports.run = async (client, message, args) => {
    if (!args[0] || isNaN(args[0])) return message.reply('請輸入有效訊息數!');
    const times = Math.floor((parseInt(args[0]) + 1) / 100);
    const left = (parseInt(args[0]) + 1) % 100;
    for (let i = 0; i < times; i++) {
        message.channel.bulkDelete(100);
    }
    message.channel.bulkDelete(left);
    message.channel.send(`我已經屏蔽了${parseInt(args[0])}則訊息!`);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'megaclear',
    description: '屏蔽許多訊息',
    usage: 'clear',
};