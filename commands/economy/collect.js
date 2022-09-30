const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const economy = require('../../models/economy.js');
const boost = require('../../models/boost.js');
const { getMulti } = require('../../modules/functions.js');

exports.run = async (client, message) => {
    let data = await economy.findOne({ discordid: message.member.id });
    if (!data) {
        data = await economy.create({
            discordid: message.member.id,
            level: 0,
        });
    }

    const { cdDB } = client.db;
    const cooldown = cdDB.get(message.author.id) || 0;

    const data5 = await credit.findOne({ discordid: message.author.id });
    if (!data5) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    let cd = 600000;
    const bt = await boost.findOne({ user: message.author.id, timestamp: { $gte: Date.now() } });
    if (bt && bt.type === 'TIME')cd = 400000;
    if (Date.now() - cooldown < cd) {
        const second = Math.round(((cd - Date.now() + cooldown) / 1000));
        if (second < 60) {
            return message.reply(`你還要再${second}秒才能領取!`);
        }

        return message.reply(`你還要再${Math.floor(second / 60)}分${second % 60}秒才能領取!`);
    }
    cdDB.set(message.author.id, Date.now());
    let giveamount = Math.round(data.level ** 1.225);

    const multi = await getMulti(message.member);

    giveamount = Math.floor(giveamount * multi);

    giveamount += 1;

    await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: giveamount } });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.tag} 的Tails幣投資系統出資!`)
                .setDescription(`已經出資 \`${giveamount}\` Tails幣`)
                .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true })),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '領取Tails幣資金',
};
