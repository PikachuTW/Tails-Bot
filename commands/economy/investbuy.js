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

    let creditData = await credit.findOne({ discordid: message.author.id });
    if (!creditData) {
        creditData = await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
    }

    if (creditData.tails_credit < Math.round((data.level + 1) ** 1.6)) {
        return message.reply(`你似乎需要 \`${Math.round((data.level + 1) ** 1.6)}\` 才能購買投資呢! :joy: :pinching_hand:`);
    }

    await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: Math.round((data.level + 1) ** 1.6) * -1 } });

    await economy.updateOne({ discordid: message.author.id }, { $inc: { level: 1 } });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.tag} 購買了新的投資!`)
                .setDescription(`你已經花費 \`${Math.round((data.level + 1) ** 1.6)}\` 購買新投資! 你現在每次可以賺 \`${Math.round((data.level + 1) ** 1.225)}\``)
                .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true }))
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
        ],
    });
};

exports.conf = {
    aliases: ['buy'],
    permLevel: 'User',
};

exports.help = {
    description: '購買投資',
    usage: 'investbuy',
};
