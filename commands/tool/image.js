const google = require('googlethis');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    if (message.channelId !== '975025966990626816' && !message.member.roles.cache.has('870741338960830544') && !message.member.roles.cache.has('989362072062165052')) return message.reply({ content: '此指令僅限 <#975025966990626816> 使用，以便管理，或是向 <@650604337000742934> 索取權限即可使用該指令', allowedMentions: { parse: [] } });
    const input = args.join(' ');

    if (!input) {
        return message.reply('請給予你要查詢的關鍵字!');
    }

    const res = await google.image(input, {
        safe: false,
    });

    if (res.length === 0) {
        return message.reply('無搜尋結果!');
    }

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setImage(res[0].url),
        ],
    });
};

exports.conf = {
    aliases: ['img'],
    permLevel: 'User',
    description: '搜尋Google圖片',
};
