exports.run = async (client, message, args) => {
    message.delete();
    const sentence = args.slice(0).join(' ');
    message.channel.send(sentence);
};

exports.conf = {
    aliases: ['say'],
    permLevel: 'Tails',
};

exports.help = {
    name: 'send',
    description: '傳送任何訊息',
    usage: 'send',
};