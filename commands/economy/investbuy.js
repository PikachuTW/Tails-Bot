const { MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');
const economyModel = require('../../models/economy.js');
const { getCredit } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    let amount = parseInt(args[0], 10);
    if (amount) {
        if (!Number.isSafeInteger(amount)) return message.reply('請提供數值');
        if (amount <= 0) return message.reply('請給予大於0的數值!');
    } else {
        amount = 1;
    }
    let { level } = await economyModel.findOneAndUpdate(
        { discordid: message.member.id },
        { $setOnInsert: { level: 0, cooldown: 0 } },
        { upsert: true, new: true },
    );
    const userCredit = await getCredit(message.member);
    let cost = 0;
    for (let i = 0; i < amount; i++) {
        cost += Math.round((level + 1) ** 1.6);
        level += 1;
    }
    if (userCredit < cost) {
        return message.reply(`你似乎需要 \`${cost}\` 才能購買投資呢! :joy: :pinching_hand:`);
    }
    await creditModel.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: cost * -1 } });
    await economyModel.updateOne({ discordid: message.author.id }, { $inc: { level: amount } });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.newName} 購買了${amount}個新的投資!`)
                .setDescription(`# 你已經花費 \`${cost}\` 購買${amount}個新投資!\n# 你現在每次可以賺 \`${Math.round((level) ** 1.225) + 1}\``)
                .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true })),
        ],
    });
};

exports.conf = {
    aliases: ['buy'],
    permLevel: 'User',
    description: '購買投資',
};
