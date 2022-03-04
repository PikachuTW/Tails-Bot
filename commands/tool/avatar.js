const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {

    const target = targetGet(message, args[0]) || message.member;
    message.reply(target.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'avatar',
    description: '獲取你的頭像',
    usage: 'avatar',
};