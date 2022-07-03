const got = require('got').default;
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const text = args.join(' ');
    if (!text) return message.reply('請給予查詢之字詞');
    let res;
    try {
        res = await got.get(`https://www.moedict.tw/uni/${text}`).json();
    } catch {
        return message.reply('搜尋不到此字詞!');
    }
    let output = '';
    output += `${res.heteronyms[0].bopomofo} ${res.heteronyms[0].pinyin}\n\n`;
    let i = 1;
    res.heteronyms[0].definitions.forEach((d) => {
        output += `\`${i}\` 解釋: ${d.def}`;
        if (d.example) {
            output += ` 範例: ${d.example.join(' ')}`;
        }
        output += '\n';
        i += 1;
    });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle(res.title)
                .setDescription(output)
                .setColor('#ffae00')],
    });
};

exports.conf = {
    aliases: ['dic'],
    permLevel: 'User',
    description: '正體中文辭典',
};
