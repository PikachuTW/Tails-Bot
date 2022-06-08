const got = require('got').default;
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const text = args.join(' ');
    if (!text) return message.reply('請給予查詢關鍵字');
    const res = await got.get(`https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(text)}&locale=en-US`).json();
    let long = false;
    if (res.documents.length > 3) {
        res.documents.length = 3;
        long = true;
    }
    const resEmbed = new MessageEmbed()
        .setAuthor({ name: 'MDN 文檔', iconURL: 'https://avatars.githubusercontent.com/u/7565578' })
        .setColor('#ffae00');

    for (let i = 0; i < res.documents.length; i++) {
        const d = res.documents[i];
        resEmbed.addField(d.title, `${d.summary}\n[**連結**](https://developer.mozilla.org${d.mdn_url})`);
    }
    if (long) {
        resEmbed.addField('更多結果', `[**連結**](https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(text)})`);
    }

    message.reply({ embeds: [resEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '獲取Mdn文檔',
};
