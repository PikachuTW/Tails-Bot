const boost = require('../../models/boost.js');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply('請提供代碼');
    const res = await boost.findOne({ id: args[0] });
    if (!res) return message.reply('此代碼不存在');
    if (res.user) return message.reply('此代碼已經兌換過了');
    const check = await boost.find({ user: message.author.id });
    let end = false;
    check.forEach((v) => {
        if (v.timestamp > Date.now()) {
            message.reply('現在已經有代碼正在使用!');
            end = true;
        }
    });
    if (end === true) return;
    await boost.updateOne({ id: args[0] }, { user: message.author.id, timestamp: Date.now() + 21600000 });
    const trans = {
        MONEY: '金錢',
        TIME: '時間',
    };
    message.reply(`你已經成功兌換投資${trans[res.type]}BOOST 6小時!`);
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '兌換BOOST代碼',
};
