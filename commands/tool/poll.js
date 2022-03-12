exports.run = async (client, message, args) => {
    const question = args.slice(0).join(' ');
    if (!question) return message.reply('請提供問題');
    message.delete();
    message.channel.send({ content: `**[投票]** ${question}`, allowedMentions: { parse: [] } }).then(replyMessage => {
        replyMessage.react('✅');
        replyMessage.react('❌');
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Top',
};

exports.help = {
    name: 'poll',
    description: '創建投票',
    usage: 'poll',
};