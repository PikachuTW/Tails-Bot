const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const economy = require('../../models/economy.js');

exports.run = async (client, message) => {
    let data = await economy.findOne({ discordid: message.member.id });
    if (!data) {
        data = await economy.create({
            discordid: message.member.id,
            level: 0,
            cooldown: 0,
        });
    }

    let data5 = await credit.findOne({ discordid: message.author.id });
    if (!data5) {
        data5 = await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    if (Date.now() - data.cooldown < 600000) {
        const second = Math.round(((600000 - Date.now() + data.cooldown) / 1000));
        if (second < 60) {
            return message.reply(`你還要再${second}秒才能領取!`);
        }

        return message.reply(`你還要再${Math.floor(second / 60)}分${second % 60}秒才能領取!`);
    }

    await economy.updateOne({ discordid: message.author.id }, { $set: { cooldown: Date.now() } });

    const giveamount = Math.round(data.level ** 1.225);

    await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: giveamount } });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.tag} 的Tails幣投資系統出資!`)
                .setDescription(`已經出資 \`${giveamount}\` Tails幣`)
                .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true }))
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '領取Tails幣資金',
};
