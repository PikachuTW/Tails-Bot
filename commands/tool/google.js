const DDG = require('duck-duck-scrape');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const input = args.join(' ');

    if (!input) {
        return message.reply('請給予你要查詢的關鍵字!');
    }

    const res = await DDG.search(input, {
        page: 0,
        safe: false,
        additional_params: {
            hl: 'zh-tw',
        },
    });

    if (res.results.length === 0) {
        return message.reply('無搜尋結果!');
    }
    const data = res.results[0];

    console.log(res, data);

    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle(data.title)
                .setColor('#ffae00')
                .setThumbnail(data?.icon)
                .setURL(data.url)
                .setDescription(data.description),
        ],
    });
};

exports.conf = {
    aliases: ['ddg', 'duckduckgo'],
    permLevel: 'User',
    description: '搜尋DuckDuckGo',
};
