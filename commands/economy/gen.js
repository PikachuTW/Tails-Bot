const { v4: uuidv4 } = require('uuid');
const boostModel = require('../../models/boost.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    const id = uuidv4();
    const type = Math.random() < 0.5 ? 'MONEY' : 'TIME';
    await boostModel.create({ id, type });
    const translate = { MONEY: '金錢', TIME: '時間' };
    if (target) {
        target.send(`恭喜你得到了: 投資${translate[type]}BOOST 6小時，你的兌換碼:\n||${id}||`);
        message.channel.send(`恭喜 ${target} 得到了投資${translate[type]}BOOST 6小時!!`);
    } else {
        message.channel.send(`恭喜你們得到了: 投資${translate[type]}BOOST 6小時，你的兌換碼:\n||${id}||`);
    }
};

exports.conf = {
    aliases: ['generate'],
    permLevel: 'Tails',
    description: '產生禮品碼',
};
