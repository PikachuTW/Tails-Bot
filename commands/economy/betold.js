const { MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');
const { getCredit } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const amount = parseInt(args[0], 10);
    if (!amount || !Number.isSafeInteger(amount)) return message.reply('請提供數值');
    if (amount <= 0) return message.reply('請給予大於0的數值!');

    let ratio = parseFloat(args[1]);
    if (!ratio) {
        ratio = 1;
    } else if (ratio <= 0 || ratio > 1) return message.reply('請給予小於等於1且大於0的數值!');

    const userCredit = await getCredit(message.member);

    if (userCredit < amount) {
        return message.reply('你的錢似乎無法負荷這樣的金額 <:thinking_cute:852936219515551754>');
    }

    let result = 1;
    let change = Math.round(amount * ratio);
    if (Math.random() < 0.5) {
        result = 0;
        change *= -1;
    }

    await creditModel.updateOne({ discordid: message.member.id }, { $inc: { tails_credit: change } });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(result ? `你贏得了 ${change} Tails幣!` : `你輸掉了 ${change * -1} Tails幣!`)
                .setDescription(`${message.author} 的餘額已經從 \`${userCredit}\` 變為 \`${userCredit + change}\` ${result ? '<:frog_thumbsup:1123596176009216041>' : '<:frog_sad:1127130401903759360>'}`),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '舊的賭博',
};
