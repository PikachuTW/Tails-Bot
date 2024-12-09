const { MessageEmbed } = require('discord.js');
const phase1 = require('../../models/phase1.js');
const nameTable = require('../../phase1nameTable.js');

exports.run = async (client, message, args) => {
    const userChoice = String(args[0]).toLowerCase();
    let craftAmount = parseInt(args[1], 10);
    if (craftAmount) {
        if (!Number.isSafeInteger(craftAmount)) return message.reply('請提供數值');
        if (craftAmount <= 0) return message.reply('請給予大於0的數值!');
    } else {
        craftAmount = 1;
    }
    const recipe = new Map([
        ['graphite', [['coal_ore', 4]]],
        ['iron_ingot', [['iron_ore', 2]]],
        ['copper_ingot', [['copper_ore', 2]]],
        ['high_purity_silicon', [['silicon_ore', 4]]],
        ['titanium_ingot', [['titanium_ore', 2]]],
        ['gear', [['iron_ingot', 2]]],
        ['magnet', [['iron_ore', 2]]],
        ['magnetic_coil', [['magnet', 5], ['copper_ingot', 2]]],
        ['circuit_board', [['iron_ingot', 4], ['copper_ingot', 2]]],
        ['motor', [['iron_ingot', 8], ['gear', 5], ['magnetic_coil', 2]]],
        ['tails_credit_acc_v1', [['iron_ingot', 8], ['high_purity_silicon', 2], ['circuit_board', 4], ['magnetic_coil', 2], ['motor', 1]]],
        ['microcrystal', [['iron_ingot', 4], ['copper_ingot', 2]]],
        ['processor', [['microcrystal', 2], ['circuit_board', 3]]],
        ['electromagnetic_turbine', [['motor', 2], ['magnetic_coil', 3]]],
        ['steel', [['iron_ingot', 5], ['coal_ore', 12]]],
        ['thruster', [['steel', 5], ['copper_ingot', 4]]],
        ['tails_credit_acc_v2', [['tails_credit_acc_v1', 5], ['electromagnetic_turbine', 4], ['processor', 10], ['thruster', 5]]],
        ['transformer_v1', [['titanium_ingot', 5], ['graphite', 5]]],
        ['mining_acc_v1', [['tails_credit_acc_v1', 1], ['transformer_v1', 1]]],
        ['oil_extractor', [['electromagnetic_turbine', 2], ['steel', 5]]],
        ['hydrogen_production_tech', [['oil_extractor', 2], ['tails_credit_acc_v1', 1]]],
        ['graphene', [['graphite', 5], ['oil', 2]]],
        ['carbon_nanotube', [['graphene', 3], ['titanium_ingot', 4]]],
        ['titanium_alloy', [['titanium_ingot', 4], ['steel', 5], ['oil', 8]]],
        ['frame_material', [['carbon_nanotube', 4], ['titanium_alloy', 2], ['high_purity_silicon', 5]]],
        ['organic_crystal', [['oil', 5], ['graphite', 4]]],
        ['titanium_crystal', [['organic_crystal', 2], ['titanium_ingot', 5]]],
        ['super_crystal', [['titanium_crystal', 2], ['graphene', 3], ['hydrogen', 15]]],
        ['crystal_filter', [['titanium_crystal', 2], ['super_crystal', 1], ['organic_crystal', 4], ['oil', 20]]],
        ['unipolar_magnet', [['magnet', 20], ['transformer_v1', 5]]],
        ['tails_credit_acc_v3', [['tails_credit_acc_v2', 3], ['frame_material', 10], ['crystal_filter', 8], ['unipolar_magnet', 20]]],
    ]);
    if (![...recipe.keys()].includes(userChoice)) {
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${message.author.username} 的製造選項`)
                    .setDescription(
                        `${[...recipe.entries()].map((choice) => `${nameTable.get(choice[0])} (${choice[0]}) ${choice[1].map((material) => `\`${nameTable.get(material[0])} x ${material[1]}\``).join(' ')}`).join('\n')}`,
                    )
                    .setFooter({ text: '請使用 t!craft iron_ingot 製造' }),
            ],
        });
    }
    const userData = await phase1.findOne({ discordid: message.author.id });
    if (!userData) {
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(
                        '**你什麼都沒有，要不要試試 t!mine iron 來獲取一些資源?**',
                    ),
            ],
        });
    }

    const updatedData = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [material, needAmount] of recipe.get(userChoice)) {
        const haveAmount = userData[material] || 0;
        if (haveAmount < needAmount * craftAmount) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#ffae00')
                        .setDescription(
                            `你材料不足喔，像是你需要 \`${needAmount * craftAmount}\`個 ${nameTable.get(material)}，但你只有 \`${haveAmount}\`個`,
                        ),
                ],
            });
        }
        updatedData[material] = haveAmount - needAmount * craftAmount;
    }
    updatedData[userChoice] = (userData[userChoice] || 0) + craftAmount;
    await phase1.findOneAndUpdate(
        { discordid: message.author.id },
        {
            $set: updatedData,
        },
        { upsert: true, new: true },
    );
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(
                    `**你製造了 \`${craftAmount}\` 個 ${nameTable.get(userChoice)}**`,
                ),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: 'phase1: 製造',
};
