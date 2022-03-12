exports.run = async (client, message, args) => {

    const list = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯'];
    if (!args[0]) return message.reply('請提供訊息ID!');
    const count = parseInt(args[1]);
    if (!count) return message.reply('請提供數量!');
    let Messages;
    try {
        Messages = await message.channel.messages.fetch(args[0]);
    }
    catch { return message.reply('無法找到訊息'); }
    if (!Messages.id) return message.reply('無法找到訊息');
    for (let i = 0; i < count; i++) {
        Messages.react(list[i]);
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'react',
    description: '投票新增表情符號',
    usage: 'react',
};