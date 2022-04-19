exports.run = async (client, message) => {
    const count = client.guilds.get('828450904990154802').memberCount;
    const memberCountChannel = client.channels.cache.find((channel) => channel.id === '897054056625885214');
    memberCountChannel.setName(`成員數:${count}`);
    message.reply(`成員數:${count}`);
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '同步成員計數',
};
