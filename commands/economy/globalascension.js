const { MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');
const miscModel = require('../../models/misc.js');
const { getCredit } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const { value_num: level } = await miscModel.findOne({ key: 'ac' });
    const next = Math.floor((level + 1) ** 2.2 + (level + 1) * 50);
    if (args[0] !== 'buy') {
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('GLOBAL ASCENSION 狀態')
                    .setColor('ffae00')
                    .setDescription(`# 目前等級 \`${level}\` 乘數 \`+${(level ** 1.11 / 2).toFixed(3)}%\`\n# \`${next}\` tails credits 即可提升至下一級`)
                    .setFooter({ text: '使用 t!ga buy 購買等級' }),
            ],
        });
    }
    const userCredit = await getCredit(message.member);
    if (userCredit < next) return message.reply(`你需要 ${next} 才能購買!`);
    await creditModel.updateOne({ discordid: message.author.id }, { $inc: { tails_credit: next * -1 } });
    await miscModel.updateOne({ key: 'ac' }, { $inc: { value_num: 1 } });
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.newName} 已經購買新提升!`)
                .setDescription(`# 你已經花費 \`${next}\` 購買新提升!\n# 現在伺服器提升乘數為 \`${((level + 1) ** 1.11 / 2).toFixed(3)}%\` (等級\`${level + 1}\`)`)
                .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true })),
        ],
    });
};

exports.conf = {
    aliases: ['ga'],
    permLevel: 'User',
    description: '傳送延遲值',
};
