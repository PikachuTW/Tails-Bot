const got = require('got');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const input = args.join(' ');

    if (!input) {
        return message.reply('請給予你要查詢的關鍵字!');
    }

    let data;

    try {
        data = await got.get(`https://zh.wikipedia.org/api/rest_v1/page/summary/${input}`, {
            Headers: {
                'Accept-Language': 'zh-tw',
            },
        }).json();
    } catch (err) {
        return message.reply('無法搜尋結果!');
    }

    try {
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(data.displaytitle)
                    .setColor('#ffae00')
                    .setThumbnail(data.thumbnail ? data.thumbnail.source : null)
                    .setURL(data.content_urls.desktop.page)
                    .setDescription(data.extract),
            ],
        });
    } catch {}
};

exports.conf = {
    aliases: [''],
    permLevel: 'User',
    description: '搜尋維基百科',
};