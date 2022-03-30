const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');

    const amount = parseInt(args[1]);

    if (!target) {
        return message.reply('請提供目標');
    }

    if (!amount) {
        return message.reply('請提供數值');
    }

    let data = await credit.findOne({ discordid: target.id });
    if (!data) {
        await credit.create({
            discordid: target.id,
            tails_credit: 0,
        });
    }
    data = await credit.findOne({ discordid: target.id });


    const before = data.tails_credit;

    await credit.findOneAndUpdate({ 'discordid': target.id }, { $inc: { 'tails_credit': amount } });

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${target.user.tag} 的tails幣餘額調整!`)
        .setDescription(`${target}的餘額已經從 \`${before}\` 變為 \`${before + amount}\``);

    const logEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${target.user.tag} 的tails幣餘額調整!`)
        .setDescription(`${target}的餘額已經從 \`${before}\` 變為 \`${before + amount}\`\n操作人: ${message.author}`);

    message.reply({ embeds: [exampleEmbed] });
    client.channels.cache.find(channel => channel.id === '934702318941777920').send({ embeds: [logEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'add',
    description: '增加你的Tails幣餘額',
    usage: 'add',
};