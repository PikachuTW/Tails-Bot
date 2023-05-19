const google = require('googlethis');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const input = args.join(' ');

    if (!input) {
        return message.reply('請給予你要查詢的關鍵字!');
    }

    const res = await google.search(input, {
        page: 0,
        safe: false,
        additional_params: {
            hl: 'zh-tw',
            as_sitesearch: 'zh.wikipedia.org',
        },
    });

    if (res.results.length === 0) {
        return message.reply('無搜尋結果!');
    }
    const data = res.results[0];

    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle(data.title)
                .setColor('#ffae00')
                .setThumbnail(data?.favicons.high_res)
                .setURL(data.url)
                .setDescription(data.description),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '搜尋Google',
};
