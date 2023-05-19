const uuid = require('uuid');
const boost = require('../../models/boost.js');

exports.run = async (client, message, args) => {
    const target = client.fn.targetGet(message, args) || message.member;
    if (!target) return message.reply('請給予有效目標!');
    const id = uuid.v4();
    const type = Math.random() < 0.5 ? 'MONEY' : 'TIME';
    await boost.create({ id, type });
    const trans = { MONEY: '金錢', TIME: '時間' };
    target.send(`恭喜你得到了: 投資${trans[type]}BOOST 6小時，你的兌換碼:\n||${id}||`);
    message.channel.send(`恭喜 ${target} 得到了投資${trans[type]}BOOST 6小時!!`);
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '產生禮品碼',
};
