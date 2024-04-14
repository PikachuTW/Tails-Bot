const afk = require('../../models/afk.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) {
        return message.reply('請給予指定用戶');
    }
    await afk.deleteOne({
        discordid: target.id,
    });

    message.reply(`已經解除 ${target} 的afk!`);
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: 'afk',
};
