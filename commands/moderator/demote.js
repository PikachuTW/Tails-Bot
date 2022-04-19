const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');
    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你身分組並沒有比他高 :weary:');

    const list = [
        // owner
        '901861966585413683',
        '870741338960830544',
        // admin
        '879001952510423040',
        '856377783163944970',
        // staff
        '879002443793448960',
        '832213672695693312',
    ];

    target.roles.remove(list);
    // log
    target.send(`${target} 已經被 ${message.author} 降職`);
    message.reply(`${target} 已經被 ${message.author} 降職`);
    client.channels.cache.find((channel) => channel.id === '936311943143247974').send(`${target} 已經被 ${message.author} 降職`);
};

exports.conf = {
    aliases: [],
    permLevel: 'Owner',
    description: '降職管理人員',
};
