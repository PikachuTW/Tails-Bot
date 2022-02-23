const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const invest = require('../../models/invest.js');
const totem = require('../../models/totem.js');
const { benefitsdata } = require('../../config.js');

exports.run = async (client, message) => {
    let data = await invest.findOne({ discordid: message.author.id });
    if (!data) {
        data = await invest.create({
            discordid: message.author.id,
            savedata: 0,
            claimcooldown: 0,
        });
    }

    let totemdata = await totem.findOne({ discordid: message.author.id });
    if (!totemdata) {
        totemdata = await totem.create({
            discordid: message.author.id,
            rank: 0,
            cooldownReduce: 0,
            investMulti: 0,
            commandCost: 0,
            giveTax: 0,
            doubleChance: 0,
        });
    }

    let data5 = await credit.findOne({ discordid: message.author.id });
    if (!data5) {
        data5 = await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    if (Date.now() - data.claimcooldown < 600000 - benefitsdata.cooldownReduce[totemdata.cooldownReduce]) {
        const second = Math.round(((600000 - benefitsdata.cooldownReduce[totemdata.cooldownReduce] - Date.now() + data.claimcooldown) / 1000));
        if (second < 60) {
            return message.reply(`你還要再${second}秒才能領取!`);
        }
        else {
            return message.reply(`你還要再${Math.floor(second / 60)}分${second % 60}秒才能領取!`);
        }
    }

    await invest.updateOne({ 'discordid': message.author.id }, { $set: { 'claimcooldown': Date.now() } });

    const payout = [1, 2, 4, 6, 8, 12, 16, 25, 36, 45, 66, 90,
    ];

    let giveamount = 0;

    const judge = new Array(12);

    let savething = data.savedata;

    let i;
    let p;

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
            giveamount += payout[p];
        }
    }

    const doubleRandom = Math.random();
    if (doubleRandom < benefitsdata.doubleChance[totemdata.doubleChance]) {
        await credit.updateOne({ 'discordid': message.author.id }, { $inc: { 'tails_credit': Math.round(giveamount * benefitsdata.investMulti[totemdata.investMulti] * 2) } });

        const exampleEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`${message.author.tag} 的Tails幣投資系統出資!`)
            .setDescription(`已經出資 \`${giveamount} x ${benefitsdata.investMulti[totemdata.investMulti]} x 2\` Tails幣`)
            .setThumbnail(message.author.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        message.reply({ embeds: [exampleEmbed] });
    }
    else {
        await credit.updateOne({ 'discordid': message.author.id }, { $inc: { 'tails_credit': Math.round(giveamount * benefitsdata.investMulti[totemdata.investMulti]) } });

        const exampleEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`${message.author.tag} 的Tails幣投資系統出資!`)
            .setDescription(`已經出資 \`${giveamount} x ${benefitsdata.investMulti[totemdata.investMulti]}\` Tails幣`)
            .setThumbnail(message.author.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        message.reply({ embeds: [exampleEmbed] });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'collect',
    category: 'Tails幣',
    description: '領取Tails幣資金',
    usage: 'collect',
};