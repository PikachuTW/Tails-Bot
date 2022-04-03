const { permlevel } = require('../../modules/functions.js');
const config = require('../../config.js');

exports.run = async (client, message, args) => {
    const target = client.fn.targetGet(message, args) || message.member;
    const level = permlevel(target);
    const friendly = config.permLevels.find((l) => l.level === level).name;
    message.reply({ content: `${target} 的權限等級為: ${friendly} (${level})`, allowedMentions: { repliedUser: 'true' } });
};

exports.conf = {
    aliases: ['perm'],
    permLevel: 'User',
};

exports.help = {
    name: 'permlevel',
    description: '回傳你目前的權限等級',
    usage: 'permlevel',
};
