const boostModel = require('../../models/boost');

exports.run = async (client, message, args) => {
    try {
        if (!args[0]) throw new Error('請提供代碼');
        const res = await boostModel.findOne({ id: args[0] });
        if (!res) throw new Error('此代碼不存在');
        if (res.user) throw new Error('此代碼已經兌換過了');
        const check = await boostModel.find({ user: message.author.id });
        const now = Date.now();
        const hasBoost = check.some((v) => v.timestamp > now);
        if (hasBoost) throw new Error('現在已經有代碼正在使用!');
        await boostModel.updateOne({ id: args[0] }, { user: message.author.id, timestamp: now + 21600000 });
        const translate = {
            MONEY: '金錢',
            TIME: '時間',
        };
        message.reply(`你已經成功兌換投資${translate[res.type]}BOOST 6小時!`);
    } catch (err) {
        message.reply(err.message);
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '兌換BOOST代碼',
};
