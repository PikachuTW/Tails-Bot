const translate = require('@vitalets/google-translate-api');

exports.run = async (client, message, args) => {
    const input = args.join(' ');

    if (!input) {
        return message.reply('請給予你要翻譯的訊息!');
    }

    translate(input, { from: 'auto', to: 'zh-TW' }).then((res) => {
        message.reply(`**[翻譯]** ${res.text}`);
    }).catch((err) => {
        console.error(err);
    });
};

exports.conf = {
    aliases: ['cn'],
    permLevel: 'User',
};

exports.help = {
    description: '翻譯任何語言到到中文(自動偵測)',
    usage: 'tw',
};
