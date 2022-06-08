const credit = require('../../models/credit.js');
const totem = require('../../models/totem.js');

exports.run = async (client, message) => {
    const price = [500, 1250, 2000, 3000, 5000, 7500, 12500, 20000, 35000, 50000, 100000, 200000];

    const data = await totem.findOne({ discordid: message.author.id });
    if (!data) {
        return message.reply('你已經沒有圖騰!');
    }

    let creditData = await credit.findOne({ discordid: message.author.id });
    if (!creditData) {
        creditData = await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    await totem.deleteOne({ discordid: message.author.id });
    if (data.rank === 0) {
        return message.reply('你已經沒有圖騰!');
    }

    await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: price[data.rank - 1] * 2 } });

    message.reply(`已經退費 ${price[data.rank - 1] * 2} tails credits!`);
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '查看你的Totem',
};
