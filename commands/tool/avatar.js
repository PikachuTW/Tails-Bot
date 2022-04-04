const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;
    message.reply(target.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    description: '獲取你的頭像',
    usage: 'avatar',
};
