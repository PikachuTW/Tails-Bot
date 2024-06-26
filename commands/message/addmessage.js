const { targetGet } = require('../../modules/functions.js');
const level = require('../../models/level.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);

    const amount = parseInt(args[1], 10);

    if (!target) return message.reply('請給予目標!');
    if (!amount) return message.reply('請給予數目!');

    let levelData = await level.findOne({ discordid: target.id });
    if (!levelData) {
        levelData = await level.create({
            discordid: target.id,
            timestamp: 0,
            daily: [],
        });
    }

    const nowMS = Date.now();
    const nowStamp = Math.floor((nowMS + 28800000) / 86400000);
    const check = await levelData.daily.find((d) => d.date === nowStamp);
    if (!check) {
        await level.updateOne({ discordid: target.id }, { $push: { daily: { date: nowStamp, count: 0 } } });
        return message.reply('此人今日尚未有訊息量!');
    }

    const nowCount = levelData.daily.find((d) => d.date === nowStamp).count;
    await level.updateOne({ discordid: target.id, 'daily.date': nowStamp }, { $inc: { 'daily.$.count': amount } });
    return message.reply(`${target} 的訊息量已經從 \`${nowCount}\` 增加到 \`${nowCount + amount}\` !`);
};

exports.conf = {
    aliases: ['addmsg', 'msgadd'],
    permLevel: 'Tails',
    description: '增加訊息量',
};
