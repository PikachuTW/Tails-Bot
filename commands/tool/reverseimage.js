const google = require('googlethis');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    if (message.channelId !== '975025966990626816' && !message.member.roles.cache.has('870741338960830544') && !message.member.roles.cache.has('989362072062165052')) return message.reply({ content: '此指令僅限 <#975025966990626816> 使用，以便管理，或是向 <@650604337000742934> 索取權限即可使用該指令', allowedMentions: { parse: [] } });

    if (message.attachments.size <= 0 || !message.attachments.first().contentType.startsWith('image')) return message.reply('請提供圖片!');

    const response = await fetch(message.attachments.first().url);

    let res = await google.search(response.body.getReader(), {
        safe: false,
        ris: true,
    });

    res = res.results;

    if (res.length === 0) {
        return message.reply('無搜尋結果!');
    }

    let output = '';

    res.forEach((element, index) => {
        const data = res[index];
        output += `[${data.title}](${data.url})\n\n${data.description}\n\n`;
    });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('以圖搜圖結果')
                .setDescription(output),
        ],
    });
};

exports.conf = {
    aliases: ['rimg', 'rimage'],
    permLevel: 'User',
    description: '搜尋Google圖片',
};
