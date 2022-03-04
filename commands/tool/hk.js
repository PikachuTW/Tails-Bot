const { translate } = require('bing-translate-api');

exports.run = async (client, message, args) => {
    const input = args.join(' ');

    if (!input) {
        return message.reply('請給予你要翻譯的訊息!');
    }
    translate(input, 'yue', 'zh-Hant', false).then(res => {
        message.reply(`**[翻譯]** ${res.translation}`);
    }).catch(err => {
        console.error(err);
        message.reply('由於使用量過多，已經被限速!');
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'hk',
    description: '翻譯廣東話到中文',
    usage: 'hk',
};