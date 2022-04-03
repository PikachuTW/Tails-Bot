const { MessageEmbed } = require('discord.js');
const { Client } = require('unb-api');
const credit = require('../../models/credit.js');

const unb = new Client(process.env.UNB);

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.reply('請提供要兌換的Tails幣數值');
    }

    const reamount = parseInt(args[0], 10);

    if (Number.isNaN(reamount) || reamount <= 0) {
        return message.reply('請提供要兌換的Tails幣數值');
    }

    if (message.author.id === '639853198248771623') {
        return message.reply('`無限金錢錯誤`');
    }

    let data = await credit.findOne({ discordid: message.author.id });
    if (!data) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
        data = await credit.findOne({ discordid: message.author.id });
    }

    const getdata = await unb.getUserBalance('828450904990154802', message.author.id);

    if (getdata.total < reamount * 50000000) {
        const notenoughEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setDescription(`你的金額似乎不足，你需要 \`${new Intl.NumberFormat('en-US').format(reamount * 50000000)}\` 林天天幣才能兌換 \`${reamount}\` 枚Tails幣`);
        message.reply({ embeds: [notenoughEmbed] });
        return;
    }

    const before = data.tails_credit;

    unb.editUserBalance('828450904990154802', message.author.id, { cash: reamount * 50000000 * -1, bank: 0 }, 'redeem request');

    await credit.findOneAndUpdate({ discordid: message.author.id }, { $inc: { tails_credit: reamount } });

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${message.author.tag} 已經兌換 ${reamount} Tails幣!`)
        .setDescription(`${message.author} 的Tails幣餘額已經從 \`${before}\` 變為 \`${before + reamount}\`\n${message.author} 的林天天幣餘額已經從 \`${new Intl.NumberFormat('en-US').format(getdata.total)}\` 變為 \`${new Intl.NumberFormat('en-US').format(getdata.total - (reamount * 50000000))}\``)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [exampleEmbed] });
    client.channels.cache.find((channel) => channel.id === '935350988964003890').send({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'redeem',
    description: '從林天天幣兌換你的Tails幣 (費率為50M林天天幣=1 Tails幣)',
    usage: 'redeem',
};
