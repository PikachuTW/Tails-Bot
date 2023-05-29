const { v4: uuidv4 } = require('uuid');
const { MessageEmbed } = require('discord.js');
const dropModel = require('../../models/drop.js');
const creditModel = require('../../models/credit.js');
const economyModel = require('../../models/economy.js');
const boostModel = require('../../models/boost.js');
const { getMulti, getCredit } = require('../../modules/functions.js');

module.exports = async (client, interaction) => {
    const timestamp = interaction.message.createdTimestamp;
    const userId = interaction.member.id;
    const res = await dropModel.findOne({ timestamp });
    if (!res) {
        interaction.reply({ content: '這個獎勵早已過時', ephemeral: true });
    } else if (res.claimed.includes(userId)) {
        interaction.reply({ content: '你早就領取過獎勵!!', ephemeral: true });
    } else {
        await dropModel.updateOne({ timestamp }, { $push: { claimed: userId } });
        const economyData = await economyModel.findOneAndUpdate(
            { discordid: userId },
            { $setOnInsert: { level: 0, cooldown: 0 } },
            { upsert: true, new: true },
        );

        await getCredit(interaction.member);

        let giveamount = Math.round(economyData.level ** 1.225);

        const multi = await getMulti(interaction.member);

        giveamount = Math.floor(giveamount * multi);

        giveamount += 1;

        await creditModel.updateOne({ discordid: userId }, { $inc: { tails_credit: giveamount } });

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(`恭喜你領取了獎勵! (${giveamount} tails credits)`),
            ],
            ephemeral: true,
        });

        if (interaction.member.roles.cache.has('856808847251734559') && Math.random() < 0.00125 * Math.floor(economyData.level / 20)) {
            const id = uuidv4();
            let type;
            if (Math.random() < 0.5) {
                type = 'MONEY';
            } else {
                type = 'TIME';
            }
            await boostModel.create({
                id,
                type,
            });
            const translate = {
                MONEY: '金錢',
                TIME: '時間',
            };
            interaction.member.send(`恭喜你得到了: 投資${translate[type]}BOOST 6小時，你的兌換碼:\n||${id}||`);
            interaction.channel.send(`恭喜 ${interaction.member} 得到了投資${translate[type]}BOOST 6小時!!`);
        }
    }
};
