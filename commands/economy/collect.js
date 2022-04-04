const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const economy = require('../../models/economy.js');
const totem = require('../../models/totem.js');
const { benefitsdata } = require('../../config.js');

exports.run = async (client, message) => {
    let data = await economy.findOne({ discordid: message.member.id });
    if (!data) {
        data = await economy.create({
            discordid: message.member.id,
            level: 0,
            cooldown: 0,
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

    if (Date.now() - data.cooldown < 600000 - benefitsdata.cooldownReduce[totemdata.cooldownReduce]) {
        const second = Math.round(((600000 - benefitsdata.cooldownReduce[totemdata.cooldownReduce] - Date.now() + data.cooldown) / 1000));
        if (second < 60) {
            return message.reply(`你還要再${second}秒才能領取!`);
        }

        return message.reply(`你還要再${Math.floor(second / 60)}分${second % 60}秒才能領取!`);
    }

    await economy.updateOne({ discordid: message.author.id }, { $set: { cooldown: Date.now() } });

    const giveamount = Math.round(data.level ** 1.225);

    const doubleRandom = Math.random();
    if (doubleRandom < benefitsdata.doubleChance[totemdata.doubleChance]) {
        await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: Math.round(giveamount * benefitsdata.investMulti[totemdata.investMulti] * 2) } });

        const exampleEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`${message.author.tag} 的Tails幣投資系統出資!`)
            .setDescription(`已經出資 \`${giveamount} x ${benefitsdata.investMulti[totemdata.investMulti]} x 2\` Tails幣`)
            .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true }))
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        message.reply({ embeds: [exampleEmbed] });
    } else {
        await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: Math.round(giveamount * benefitsdata.investMulti[totemdata.investMulti]) } });

        const exampleEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`${message.author.tag} 的Tails幣投資系統出資!`)
            .setDescription(`已經出資 \`${giveamount} x ${benefitsdata.investMulti[totemdata.investMulti]}\` Tails幣`)
            .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true }))
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        message.reply({ embeds: [exampleEmbed] });
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    description: '領取Tails幣資金',
    usage: 'collect',
};
