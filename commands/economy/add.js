const { MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');
const { targetGet, getCredit } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');

    const amount = parseInt(args[1], 10);
    if (!amount) return message.reply('請提供數值');

    const before = await getCredit(target);
    await creditModel.updateOne({ discordid: target.id }, { $inc: { tails_credit: amount } });

    const embed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${target.user.tag} 的tails幣餘額調整!`)
        .setDescription(`# ${target}的餘額已經從 \`${before}\` 變為 \`${before + amount}\`\n# 操作人: ${message.author}`);

    message.reply({ embeds: [embed] });
    client.channels.cache.get('934702318941777920').send({ embeds: [embed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '增加你的Tails幣餘額',
};
