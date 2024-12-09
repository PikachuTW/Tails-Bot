const { MessageEmbed } = require('discord.js');
const economyModel = require('../../models/economy.js');
const phase1 = require('../../models/phase1.js');
const nameTable = require('../../phase1nameTable.js');

exports.run = async (client, message, args) => {
    const choices = new Map([
        ['coal', '煤炭 Coal'],
        ['iron', '鐵原礦 Iron Ore'],
        ['copper', '銅原礦 Copper Ore'],
        ['silicon', '矽原礦 Silicon Ore'],
        ['titanium', '鈦原礦 Titanium Ore'],
    ]);

    const multiply = new Map([
        ['coal', 1.5],
        ['iron', 1],
        ['copper', 1],
        ['silicon', 0.5],
        ['titanium', 0.5],
    ]);

    const userChoice = String(args[0]).toLowerCase();

    const { level } = await economyModel.findOneAndUpdate(
        { discordid: message.member.id },
        { $setOnInsert: { level: 0, cooldown: 0 } },
        { upsert: true, new: true },
    );

    const phase1Data = await phase1.findOne({ discordid: message.author.id });

    let mineAmount = (level + 24) ** 0.7 / 9;

    const originalMineAmount = Math.floor(mineAmount);

    let tails_credit_acc_v1 = 0;
    if (phase1Data && phase1Data.tails_credit_acc_v1) {
        tails_credit_acc_v1 = phase1Data.tails_credit_acc_v1;
    }
    if (tails_credit_acc_v1 > 10) tails_credit_acc_v1 = 10;
    mineAmount *= (1 + tails_credit_acc_v1 * 0.25);

    mineAmount = Math.floor(mineAmount);

    if (![...choices.keys()].includes(userChoice)) {
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${message.author.username} 的挖礦選項`)
                    .setDescription(
                        `${[...choices.entries()].map((choice) => `\`${choice[0]}\` ${choice[1]} (x${multiply.get(choice[0])})`).join('\n')}\n\n你的挖力目前是 \`${mineAmount}/次\` (原始 \`${originalMineAmount}/次\`)\n下一個在tails幣投資等級 \`${Math.ceil(((mineAmount + 1) * 9) ** (1 / 0.7) - 24)}\``,
                    )
                    .setFooter({ text: '請使用 t!mine iron 挖礦' }),
            ],
        });
    }

    const userData = await phase1.findOne({ discordid: message.author.id });
    if (userData && userData.cooldown && Date.now() - userData.cooldown < 600000) {
        const remainingTime = Math.round(((600000 - Date.now() + userData.cooldown) / 1000));
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeLeft = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
        return message.reply(`你還要再${timeLeft}才能領取!`);
    }

    let originalAmount = 0;

    if (userData) {
        originalAmount = userData[`${userChoice}_ore`] || 0;
    }

    mineAmount = Math.floor(mineAmount * multiply.get(userChoice));

    await phase1.findOneAndUpdate(
        { discordid: message.author.id },
        {
            $set: {
                cooldown: Date.now(),
                [`${userChoice}_ore`]: originalAmount + mineAmount,
            },
        },
        { upsert: true, new: true },
    );

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(
                    `**+${mineAmount} ${nameTable.get(`${userChoice}_ore`)}**`,
                ),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: 'phase1: 挖礦',
};
