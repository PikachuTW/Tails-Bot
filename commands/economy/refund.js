const invest = require('../../models/invest.js');
const credit = require('../../models/credit.js');

exports.run = async (client, message) => {

    const data = await invest.findOne({ discordid: message.member.id });
    if (!data) return message.reply('傻逼你的舊投資目前為空，無法退費 :frog:');

    let creditData = await credit.findOne({ discordid: message.author.id });
    if (!creditData) {
        creditData = await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    const price = [20, 50, 120, 200, 400, 750, 1250, 2500, 4000, 6000, 10000, 15000,
    ];

    let re = 0;

    let i, p;

    const judge = new Array(12);

    let savething = data.savedata;

    if (savething != 0) {
        for (i = 11; i >= 0; i--) {
            if (savething >= Math.pow(2, i)) {
                savething -= Math.pow(2, i);
                judge[i] = true;
            }
            else {
                judge[i] = false;
            }
        }
    }
    else {
        for (i = 11; i >= 0; i--) {
            judge[i] = false;
        }
    }

    for (p = 0; p <= 11; p++) {
        if (judge[p] == true) {
            re += price[p];
        }
    }

    await credit.updateOne({ discordid: message.member.id }, { $inc: { tails_credit: re } });
    await invest.deleteOne({ discordid: message.member.id });

    message.reply(`你已經退了 ${re} Tails Credits`);
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'refund',
    description: '退費',
    usage: 'refund',
};