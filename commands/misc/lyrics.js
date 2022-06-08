exports.run = async (client, message, args) => {
    const name = args.slice(0).join(' ');
    if (!name) return message.reply('請提供歌曲名稱!');
    const lyrics = await require('lyrics-finder')('', name) || '無搜尋結果';
    message.reply({ content: `\`\`\`${lyrics.slice(0, 1994)}\`\`\``, allowedMentions: { parse: ['users'] } });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '搜尋歌詞',
};
