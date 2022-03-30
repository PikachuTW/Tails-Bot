const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const invest = require('../../models/invest.js');

exports.run = async (client, message, args) => {

    if (!args[0]) {
        return message.reply('請提供數字!');
    }

    if (parseInt(args[0]) < 0 || parseInt(args[0]) > 12) {
        return message.reply('請提供1~12的有效範圍數字');
    }
    let data = await invest.findOne({ discordid: message.author.id });
    if (!data) {
        await invest.create({
            discordid: message.author.id,
            savedata: 0,
            claimcooldown: 0,
        });
        data = await invest.findOne({ discordid: message.author.id });
    }

    const data5 = await credit.findOne({ discordid: message.author.id });
    if (!data5) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    const price = [20, 50, 120, 200, 400, 750, 1250, 2500, 4000, 6000, 10000, 15000,
    ];

    const payout = [1, 2, 4, 6, 8, 12, 16, 25, 36, 45, 66, 90,
    ];

    if (data5.tails_credit < price[parseInt(args[0]) - 1]) {
        return message.reply('你似乎沒錢呢! :joy: :pinching_hand:');
    }

    const judge = new Array(12);

    let savething = data.savedata;

    let i;

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

    if (judge[parseInt(args[0]) - 1] == true) {
        return message.reply('你已經買過了!');
    }


    await credit.findOneAndUpdate({ 'discordid': message.author.id }, { $inc: { 'tails_credit': price[parseInt(args[0]) - 1] * -1 } });

    await invest.findOneAndUpdate({ 'discordid': message.author.id }, { $inc: { 'savedata': Math.pow(2, parseInt(args[0]) - 1) } });


    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${message.author.tag} 購買了新的投資!`)
        .setDescription(`價錢${price[parseInt(args[0]) - 1]} 出資${payout[parseInt(args[0]) - 1]} 已被購買!`)
        .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true }))
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: ['buy'],
    permLevel: 'Tails',
};

exports.help = {
    name: 'investbuy',
    description: '購買投資',
    usage: 'investbuy',
};