const uuid = require('uuid');
const { MessageEmbed } = require('discord.js');
const drop = require('../../models/drop.js');
const credit = require('../../models/credit.js');
const economy = require('../../models/economy.js');
const boost = require('../../models/boost.js');
const { getMulti } = require('../../modules/functions.js');

module.exports = async (client, interaction) => {
    const timestamp = interaction.message.createdTimestamp;
    const userId = interaction.member.id;
    const res = await drop.findOne({ timestamp });
    if (!res) {
        interaction.reply({ content: '這個獎勵早已過時', ephemeral: true });
    } else if (res.claimed.indexOf(userId) !== -1) {
        interaction.reply({ content: '你早就領取過獎勵!!', ephemeral: true });
    } else {
        await drop.updateOne({ timestamp }, { $push: { claimed: userId } });
        let data = await economy.findOne({ discordid: userId });
        if (!data) {
            data = await economy.create({
                discordid: userId,
                level: 0,
                cooldown: 0,
            });
        }

        const data5 = await credit.findOne({ discordid: userId });
        if (!data5) {
            await credit.create({
                discordid: userId,
                tails_credit: 0,
            });
        }

        let giveamount = Math.round(data.level ** 1.225);

        const multi = await getMulti(interaction.member);

        giveamount = Math.floor(giveamount * multi);

        giveamount += 1;

        await credit.updateOne({ discordid: userId }, { $inc: { tails_credit: giveamount } });

        interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(`恭喜你領取了獎勵! (${giveamount} tails credits)`),
            ],
            ephemeral: true,
        });

        if (interaction.member.roles.cache.has('856808847251734559') && Math.random() < 0.0015 * Math.floor(data.level / 20)) {
            const id = uuid.v4();
            let type;
            if (Math.random() < 0.5) {
                type = 'MONEY';
            } else {
                type = 'TIME';
            }
            await boost.create({
                id,
                type,
            });
            const trans = {
                MONEY: '金錢',
                TIME: '時間',
            };
            interaction.member.send(`恭喜你得到了: 投資${trans[type]}BOOST 6小時，你的兌換碼:\n||${id}||`);
            interaction.channel.send(`恭喜 ${interaction.member} 得到了投資${trans[type]}BOOST 6小時!!`);
        }
    }
};
