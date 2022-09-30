const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    let target;
    if (args[0]) {
        target = targetGet(message, args) || await client.users.fetch(args[0]) || message.member;
    } else {
        target = message.member;
    }
    message.reply(target.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }));
};

exports.conf = {
    aliases: ['av'],
    permLevel: 'User',
    description: '獲取你的頭像',
};
