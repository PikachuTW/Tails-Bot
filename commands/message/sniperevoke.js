const credit = require('../../models/credit.js');
const snipedata = require('../../models/snipedata.js');
const totem = require('../../models/totem.js');
const { benefitsdata } = require('../../config.js');

exports.run = async (client, message) => {
    message.delete();
    let data = await credit.findOne({ discordid: message.author.id });
    if (!data) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
        data = await credit.findOne({ discordid: message.author.id });
    }

    let totemdata = await totem.findOne({ discordid: message.author.id });
    if (!data) {
        await totem.create({
            discordid: message.author.id,
            rank: 0,
            cooldownReduce: 0,
            investMulti: 0,
            commandCost: 0,
            giveTax: 0,
            doubleChance: 0,
        });
        totemdata = await totem.findOne({ discordid: message.author.id });
    }

    const before = data.tails_credit;

    if (before >= Math.round(75 * benefitsdata.commandCost[totemdata.commandCost])) {
        await credit.findOneAndUpdate({ discordid: message.author.id }, { $inc: { tails_credit: -1 * Math.round(75 * benefitsdata.commandCost[totemdata.commandCost]) } });

        const sdata = await snipedata.findOne({ channelid: message.channel.id });
        if (!sdata) {
            await snipedata.create({
                channelid: message.channel.id,
                snipemsg: 'test',
                snipesender: 123,
                snipetime: 'test',
                snipeatt: 'test',
            });
        }

        await snipedata.findOneAndUpdate({ channelid: message.channel.id }, { $set: { snipemsg: '```已屏蔽```', snipetime: '屏蔽了🙈', snipeatt: null } });
    } else {
        message.member.send(`你似乎沒有足夠的tails幣呢(收費${Math.round(75 * benefitsdata.commandCost[totemdata.commandCost])}枚) :joy: :pinching_hand:`);
    }
};

exports.conf = {
    aliases: ['rs', 'rsnipe', 'sr'],
    permLevel: 'User',
    description: '屏蔽Snipe訊息',
};
