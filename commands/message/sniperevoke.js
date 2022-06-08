const credit = require('../../models/credit.js');
const snipedata = require('../../models/snipedata.js');

exports.run = async (client, message) => {
    message.delete();
    let data = await credit.findOne({ discordid: message.author.id });
    if (!data) {
        data = await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    const before = data.tails_credit;

    if (before >= 75) {
        await credit.findOneAndUpdate({ discordid: message.author.id }, { $inc: { tails_credit: -75 } });

        const sdata = await snipedata.findOne({ channelid: message.channel.id });
        if (!sdata) {
            await snipedata.create({
                channelid: message.channel.id,
                snipemsg: 'test',
                snipesender: 123,
                snipetime: 'test',
            });
        }

        await snipedata.findOneAndUpdate({ channelid: message.channel.id }, { $set: { snipemsg: '```已屏蔽```', snipetime: '屏蔽了🙈', snipeatt: null } });
    } else {
        message.member.send('你似乎沒有足夠的tails幣呢(收費75枚) :joy: :pinching_hand:');
    }
};

exports.conf = {
    aliases: ['rs', 'rsnipe', 'sr'],
    permLevel: 'User',
    description: '屏蔽Snipe訊息',
};
