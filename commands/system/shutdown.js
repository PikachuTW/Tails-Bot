exports.run = async (client, message) => {
    await message.reply('機器人已關閉');
    process.exit(0);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'shutdown',
    category: '系統',
    description: '關閉機器人',
    usage: 'shutdown',
};