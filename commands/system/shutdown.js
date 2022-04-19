exports.run = async (client, message) => {
    await message.reply('機器人已關閉');
    process.exit(0);
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '關閉機器人',
};
