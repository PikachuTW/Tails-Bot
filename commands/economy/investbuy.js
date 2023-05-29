const { MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');
const economyModel = require('../../models/economy.js');
const { getCredit } = require('../../modules/functions.js');

exports.run = async (client, message) => {
    const { level } = await economyModel.findOneAndUpdate(
        { discordid: message.member.id },
        { $setOnInsert: { level: 0, cooldown: 0 } },
        { upsert: true, new: true },
    );
    const userCredit = await getCredit(message.member);

    if (userCredit < Math.round((level + 1) ** 1.6)) {
        return message.reply(`你似乎需要 \`${Math.round((level + 1) ** 1.6)}\` 才能購買投資呢! :joy: :pinching_hand:`);
    }

    await creditModel.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: Math.round((level + 1) ** 1.6) * -1 } });
    await economyModel.updateOne({ discordid: message.author.id }, { $inc: { level: 1 } });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.tag} 購買了新的投資!`)
                .setDescription(`# 你已經花費 \`${Math.round((level + 1) ** 1.6)}\` 購買新投資!\n# 你現在每次可以賺 \`${Math.round((level + 1) ** 1.225) + 1}\``)
                .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true })),
        ],
    });
};

exports.conf = {
    aliases: ['buy'],
    permLevel: 'User',
    description: '購買投資',
};
