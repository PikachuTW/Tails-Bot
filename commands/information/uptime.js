const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => {
    const duration = moment.duration(client.uptime).format(' D [天], H [小時], m [分], s [秒]');
    message.reply(`機器人上線時間: \`${duration}\``);
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    description: '回傳機器人上線時間',
    usage: 'uptime',
};
