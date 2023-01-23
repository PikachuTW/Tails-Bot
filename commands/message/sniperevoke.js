const { Routes } = require('discord-api-types/v10');
const snipe = require('../../models/snipe.js');

exports.run = async (client, message) => {
    if (!message.member.roles.cache.has('856808847251734559')) return message.reply('你需要活躍成員才能使用');
    await snipe.updateOne({ channelid: message.channel.id }, { $set: { snipemsg: '```已屏蔽```', snipetime: '屏蔽了🙈', snipeatt: null } });
    try {
        await client.container.rest.delete(Routes.channelMessage(message.channel.id, message.id));
    } catch {}
};

exports.conf = {
    aliases: ['rs', 'rsnipe', 'sr'],
    permLevel: 'User',
    description: '屏蔽Snipe訊息',
};
