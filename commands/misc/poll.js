exports.run = async (client, message, args) => {
    const question = args.slice(0).join(' ');
    if (!question) return message.reply('請提供問題');
    await message.channel.send({ content: `**[投票]** ${question}`, allowedMentions: { parse: [] } }).then((replyMessage) => {
        replyMessage.react('✅');
        replyMessage.react('❌');
    });
    await message.delete();
};

exports.conf = {
    aliases: [],
    permLevel: 'Highest',
    description: '創建投票',
};
