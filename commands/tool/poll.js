exports.run = async (client, message, args) => {
    const question = args.slice(0).join(' ');
    if (!question) return message.reply('請提供問題');
    message.channel.send({ content: `**[投票 By ${message.author.tag}]** ${question}`, allowedMentions: { parse: [] } }).then(replyMessage => {
        replyMessage.react('✅');
        replyMessage.react('❌');
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Heiegg',
};

exports.help = {
    name: 'poll',
    description: '創建投票',
    usage: 'poll',
};