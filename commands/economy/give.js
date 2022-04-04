const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const totem = require('../../models/totem.js');
const { benefitsdata } = require('../../config.js');
const { benefitsdisplay } = require('../../config.js');

exports.run = async (client, message, args) => {
    const target = message.mentions.members.first() || message.guild.members.cache.find((member) => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');
    const amount = parseInt(args[1], 10);

    if (!amount) {
        return message.reply('請提供數值');
    }

    if (amount <= 0) {
        return message.reply('請給予大於0的數值!');
    }

    if (target.id === message.author.id) {
        return message.reply('不能給自己 :joy: :pinching_hand:');
    }

    let data = await credit.findOne({ discordid: target.id });
    if (!data) {
        await credit.create({
            discordid: target.id,
            tails_credit: 0,
        });
        data = await credit.findOne({ discordid: target.id });
    }

    let totemdata = await totem.findOne({ discordid: message.author.id });
    if (!totemdata) {
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

    const targetcredit = data.tails_credit;

    let senderData = await credit.findOne({ discordid: message.author.id });

    if (!senderData) {
        senderData = await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    const sendercredit = senderData.tails_credit;

    if (sendercredit < amount) {
        return message.reply('你的錢似乎無法負荷這樣的金額 <:thinking_cute:852936219515551754>');
    }

    await credit.findOneAndUpdate({ discordid: target.id }, { $inc: { tails_credit: Math.floor(amount * (1 - benefitsdata.giveTax[totemdata.giveTax])) } });

    await credit.findOneAndUpdate({ discordid: message.author.id }, { $inc: { tails_credit: amount * -1 } });

    const logEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${message.author.tag} 給予 ${target.user.tag} ${amount} Tails幣!`)
        .setDescription(`${message.author} 的餘額已經從 \`${sendercredit}\` 變為 \`${sendercredit - amount}\`\n${target} 的餘額已經從 \`${targetcredit}\` 變為 \`${Math.floor(targetcredit + amount * (1 - benefitsdata.giveTax[totemdata.giveTax]))}\` (${benefitsdisplay.giveTax[totemdata.giveTax] !== '無' ? benefitsdisplay.giveTax[totemdata.giveTax] : '10%'}稅率)`);

    message.reply({ embeds: [logEmbed] });
    client.channels.cache.find((channel) => channel.id === '934885945113739355').send({ embeds: [logEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    description: '給予你的Tails幣餘額給他人',
    usage: 'give',
};
