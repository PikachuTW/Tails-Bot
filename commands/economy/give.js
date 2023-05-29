const { MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');
const { getCredit } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = message.mentions.members.first() || message.guild.members.cache.find((member) => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');

    const { id: senderId } = message.author;
    const { id: targetId } = target;

    const amount = parseInt(args[1], 10);
    if (!amount || !Number.isSafeInteger(amount)) return message.reply('請提供數值');
    if (amount <= 0) return message.reply('請給予大於0的數值!');
    if (targetId === senderId) return message.reply('不能給自己 :joy: :pinching_hand:');

    const targetCredit = await getCredit(target);
    const senderCredit = await getCredit(message.member);

    if (senderCredit < amount) {
        return message.reply('你的錢似乎無法負荷這樣的金額 <:thinking_cute:852936219515551754>');
    }

    await creditModel.updateOne({ discordid: targetId }, { $inc: { tails_credit: Math.floor(amount * 0.9) } });
    await creditModel.updateOne({ discordid: senderId }, { $inc: { tails_credit: amount * -1 } });

    const logEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${message.author.tag} 給予 ${target.user.tag} ${amount} Tails幣!`)
        .setDescription(`${message.author} 的餘額已經從 \`${senderCredit}\` 變為 \`${senderCredit - amount}\`\n${target} 的餘額已經從 \`${targetCredit}\` 變為 \`${Math.floor(targetCredit + amount * 0.9)}\` (10%稅率)`);

    message.reply({ embeds: [logEmbed] });
    client.channels.cache.get('934885945113739355').send({ embeds: [logEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '給予你的Tails幣餘額給他人',
};
