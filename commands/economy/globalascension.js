const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const ascension = require('../../models/ascension.js');
const { getAs, getCredit } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const as = await getAs();
    const next = Math.floor((as + 1) ** 2.2 + (as + 1) * 50);
    if (args[0] !== 'buy') {
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('GLOBAL ASCENSION 狀態')
                    .setColor('ffae00')
                    .setDescription(`目前等級 \`${as}\` 乘數 \`+${(as ** 1.11 / 2).toFixed(3)}%\`\n\`${next}\` tails credits 即可提升至下一級`)
                    .setFooter({ text: '使用 t!ga buy 購買等級' }),
            ],
        });
    } else {
        const res = await getCredit(message.member);
        if (res < next) return message.reply(`你需要 ${next} 才能購買!`);
        await credit.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: next * -1 } });
        await ascension.updateOne({ day: Math.floor((Date.now() + 28800000) / 86400000) }, { $inc: { level: 1 } });
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${message.author.tag} 已經購買新提升!`)
                    .setDescription(`你已經花費 \`${next}\` 購買新提升! 現在伺服器提升乘數為 \`${((as + 1) ** 1.11 / 2).toFixed(3)}%\``)
                    .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true })),
            ],
        });
    }
};

exports.conf = {
    aliases: ['ga'],
    permLevel: 'User',
    description: '傳送延遲值',
};
