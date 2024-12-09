const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const creditModel = require('../../models/credit.js');
const { getCredit, delay } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const amount = parseInt(args[0], 10);
    if (!amount || !Number.isSafeInteger(amount)) return message.reply('請提供數值');
    if (amount <= 0) return message.reply('請給予大於0的數值!');

    const userCredit = await getCredit(message.member);

    if (userCredit < amount) {
        return message.reply('你的錢似乎無法負荷這樣的金額 <:thinking_cute:852936219515551754>');
    }

    await creditModel.updateOne({ discordid: message.member.id }, { $inc: { tails_credit: amount * -1 } });

    let buttons = [];
    const multi = [0, 4, 2, 1.5, 1.2, 1];
    let buttonLeft = 5;

    const answer = Math.floor(Math.random() * 5) + 1;

    for (let i = 1; i <= 5; i++) {
        buttons.push(
            new MessageButton()
                .setCustomId(`betDefault${i}`)
                .setLabel('❓')
                .setStyle('SECONDARY'),
        );
    }

    const messageGenerator = () => ({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('挖挖挖，小草或地雷？')
                .setDescription(`\`\`\`你的賭金：${amount}\n目前乘數：x${multi[buttonLeft]}\`\`\``),
        ],
        components: [
            new MessageActionRow()
                .addComponents(buttons),
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('betFinish')
                        .setLabel('賭到這裡為止')
                        .setStyle('PRIMARY'),
                ),
        ],
    });
    const Message = await message.channel.send(messageGenerator());

    const sendAndWait = async () => {
        try {
            const response = await Message.awaitMessageComponent({ filter: (i) => (i.user.id === message.author.id), time: 60000 });
            if (response.customId.startsWith('betDefault')) {
                const index = response.customId.charAt(response.customId.length - 1);
                if (`${index}` !== `${answer}`) {
                    buttonLeft -= 1;
                    buttons[index - 1] = new MessageButton()
                        .setCustomId(`betSafe${index}`)
                        .setLabel('🌱')
                        .setStyle('SUCCESS')
                        .setDisabled(true);
                    await response.update(messageGenerator());
                    if (buttonLeft >= 2) {
                        delay(400);
                        await sendAndWait();
                    } else {
                        buttons = buttons.map((button) => button.setDisabled(true));
                        await Message.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setColor('#ffae00')
                                    .setTitle('挖挖挖，小草或地雷？')
                                    .setDescription(`\`\`\`diff\n+ 恭喜你成功賭贏 ${Math.floor(amount * (multi[buttonLeft] - 1))} tails幣\`\`\``),
                            ],
                            components: [
                                new MessageActionRow()
                                    .addComponents(buttons),
                                new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('betFinish')
                                            .setLabel('賭到這裡為止')
                                            .setStyle('PRIMARY')
                                            .setDisabled(true),
                                    ),
                            ],
                        });
                        await creditModel.updateOne({ discordid: message.member.id }, { $inc: { tails_credit: Math.floor(amount * multi[buttonLeft]) } });
                    }
                } else {
                    buttons[index - 1] = new MessageButton()
                        .setCustomId('betBomb')
                        .setLabel('💣')
                        .setStyle('DANGER');
                    buttons = buttons.map((button) => button.setDisabled(true));
                    await response.update({
                        embeds: [
                            new MessageEmbed()
                                .setColor('#ffae00')
                                .setTitle('挖挖挖，小草或地雷？')
                                .setDescription('```diff\n- 你踩到了地雷，失去了一切 :(```'),
                        ],
                        components: [
                            new MessageActionRow()
                                .addComponents(buttons),
                            new MessageActionRow()
                                .addComponents(
                                    new MessageButton()
                                        .setCustomId('betFinish')
                                        .setLabel('賭到這裡為止')
                                        .setStyle('PRIMARY')
                                        .setDisabled(true),
                                ),
                        ],
                    });
                }
            } else if (response.customId.startsWith('betFinish')) {
                buttons = buttons.map((button) => button.setDisabled(true));
                await response.update({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#ffae00')
                            .setTitle('挖挖挖，小草或地雷？')
                            .setDescription(`\`\`\`diff\n+ 恭喜你成功賭贏 ${Math.round(amount * (multi[buttonLeft] - 1))} tails幣\`\`\``),
                    ],
                    components: [
                        new MessageActionRow()
                            .addComponents(buttons),
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('betFinish')
                                    .setLabel('賭到這裡為止')
                                    .setStyle('PRIMARY')
                                    .setDisabled(true),
                            ),
                    ],
                });
                await creditModel.updateOne({ discordid: message.member.id }, { $inc: { tails_credit: Math.floor(amount * multi[buttonLeft]) } });
            } else if (response.customId.startsWith('betSafe')) {
                await sendAndWait();
            }
        } catch (e) {
            buttons = buttons.map((button) => button.setDisabled(true));
            await Message.edit({
                embeds: [
                    new MessageEmbed()
                        .setColor('#ffae00')
                        .setTitle('挖挖挖，小草或地雷？')
                        .setDescription(`\`\`\`diff\n${e}\n# 沒有回應，已經自動幫你結束\n+ 恭喜你成功賭贏 ${Math.round(amount * (multi[buttonLeft] - 1))} tails幣\`\`\``),
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(buttons),
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('betFinish')
                                .setLabel('賭到這裡為止')
                                .setStyle('PRIMARY')
                                .setDisabled(true),
                        ),
                ],
            });
            await creditModel.updateOne({ discordid: message.member.id }, { $inc: { tails_credit: Math.round(amount * multi[buttonLeft]) } });
        }
    };
    await sendAndWait();
};

exports.conf = {
    aliases: ['betnew'],
    permLevel: 'User',
    description: '新的賭博',
};
