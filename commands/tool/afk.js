const afk = require('../../models/afk.js');

exports.run = async (client, message, args) => {
    const input = args.slice(0).join(' ');
    if (!input) {
        return message.reply('請提供內容');
    }
    if (input.length > 300) {
        return message.reply('給予的字元數必須小於等於100!');
    }

    const data = await afk.findOne({ discordid: message.member.id });
    if (data) return message.reply('你已早在afk中');

    await afk.create({
        discordid: message.member.id,
        content: input,
    });

    message.reply('你已經成功afk!');
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: 'afk',
    usage: 'afk',
};
