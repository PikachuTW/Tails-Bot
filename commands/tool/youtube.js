const { DiscordTogether } = require('discord-together');

exports.run = async (client, message) => {
    if (!message.member.voice.channel) return message.reply('你需要加入一個語音頻道');

    new DiscordTogether(client).createTogetherCode(message.member.voice.channel.id, 'youtube').then((invite) => message.channel.send(`${invite.code}`));
};

exports.conf = {
    aliases: ['yt'],
    permLevel: 'User',
    description: '觀看Youtube影片',
    usage: 'youtube',
};
