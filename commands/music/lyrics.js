const { codeBlock } = require('@discordjs/builders');

exports.run = async (client, message, args) => {
    const name = args.slice(0).join(' ');
    if (!name) return message.reply('請提供歌曲名稱!');
    const lyrics = await require('lyrics-finder')('', name) || '無搜尋結果';
    if (lyrics.length > 2000) return message.reply('歌詞太長!');
    message.reply(codeBlock(lyrics));
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '搜尋歌詞',
};
