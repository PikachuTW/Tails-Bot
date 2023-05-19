const translate = require('@iamtraction/google-translate');

exports.run = async (client, message, args) => {
    const input = args.join(' ');

    if (!input) {
        return message.reply('請給予你要翻譯的訊息!');
    }

    translate(input, { to: 'zh-tw' }).then((res) => {
        message.reply({ content: `**[翻譯]** ${res.text}`, allowedMentions: { parse: ['users'] } });
    }).catch((err) => {
        console.error(err);
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '翻譯任何語言到到中文(自動偵測)',
};
