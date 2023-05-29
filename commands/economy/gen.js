const { v4: uuidv4 } = require('uuid');
const boostModel = require('../../models/boost.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');
    const id = uuidv4();
    const type = Math.random() < 0.5 ? 'MONEY' : 'TIME';
    await boostModel.create({ id, type });
    const translate = { MONEY: '金錢', TIME: '時間' };
    target.send(`恭喜你得到了: 投資${translate[type]}BOOST 6小時，你的兌換碼:\n||${id}||`);
    message.channel.send(`恭喜 ${target} 得到了投資${translate[type]}BOOST 6小時!!`);
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '產生禮品碼',
};
