const { MessageEmbed } = require('discord.js');
const roman = require('romans');
const totem = require('../../models/totem.js');
const credit = require('../../models/credit.js');
const { benefitsdisplay } = require('../../config.js');

exports.run = async (client, message, args) => {
    const price = [500, 1250, 2000, 3000, 5000, 7500, 12500, 20000, 35000, 50000, 100000, 200000];

    if (!args[0] || args[0] === 'list' || parseInt(args[0], 10) > 12 || parseInt(args[0], 10) < 0) {
        let res = '';
        for (let i = 0; i < 12; i++) {
            res += `\`${i + 1}\` 圖騰等級 \`${roman.romanize(i + 1)}\` 價錢 \`${price[i]}\`\n`;
        }
        const gachaembed = new MessageEmbed()
            .setTitle('Totem列表')
            .setColor('#ffae00')
            .setDescription(res)
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
        return message.reply({ embeds: [gachaembed] });
    }

    const buyrank = parseInt(args[0], 10);

    let creditdata = await credit.findOne({ discordid: message.author.id });
    if (!creditdata) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
        creditdata = await credit.findOne({ discordid: message.author.id });
    }

    if (creditdata.tails_credit < price[buyrank - 1]) {
        return message.reply('你似乎買不起圖騰呢! :joy: :pinching_hand:');
    }

    await credit.findOneAndUpdate({ discordid: message.author.id }, { $inc: { tails_credit: price[buyrank - 1] * -1 } });

    const randomResult = [0, 0];
    let randomNum;

    while (randomResult[0] === randomResult[1]) {
        for (let i = 0; i < 2; i++) {
            randomNum = Math.random();
            if (randomNum < 0.1) {
                randomResult[i] = 1;
            } else if (randomNum < 0.2) {
                randomResult[i] = 2;
            } else if (randomNum < 0.55) {
                randomResult[i] = 3;
            } else if (randomNum < 0.9) {
                randomResult[i] = 4;
            } else {
                randomResult[i] = 5;
            }
        }
    }

    // const tier = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];
    const aRes = ['無', '無', '無', '無', '無'];
    // let new_cooldownReduce = '無';
    // let new_investMulti = '無';
    // let new_commandCost = '無';
    // let new_giveTax = '無';
    // let new_doubleChance = '無';

    for (let p = 0; p < 2; p++) {
        if (randomResult[p] === 1) {
            aRes[0] = benefitsdisplay.cooldownReduce[Math.ceil((buyrank + p) / 2)];
        } else if (randomResult[p] === 2) {
            aRes[1] = benefitsdisplay.investMulti[Math.ceil((buyrank + p) / 2)];
        } else if (randomResult[p] === 3) {
            aRes[2] = benefitsdisplay.commandCost[Math.ceil((buyrank + p) / 2)];
        } else if (randomResult[p] === 4) {
            aRes[3] = benefitsdisplay.giveTax[Math.ceil((buyrank + p) / 2)];
        } else {
            aRes[4] = benefitsdisplay.doubleChance[Math.ceil((buyrank + p) / 2)];
        }
    }

    const newEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${message.author.tag} 新圖騰購買結果`)
        .setDescription(`**圖騰等級** \`${roman.romanize(buyrank)}\``)
        .addField('投資出資冷卻', `\`${aRes[0]}\``, true)
        .addField('投資出資乘數', `\`${aRes[1]}\``, true)
        .addField('指令花費金額', `\`${aRes[2]}\``, true)
        .addField('贈與金錢稅金', `\`${aRes[3]}\``, true)
        .addField('雙倍金額機會', `\`${aRes[4]}\``, true)
        .setThumbnail(message.member.displayAvatarURL({ format: 'png', dynamic: true }))
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [newEmbed] });
    message.reply('你是否要替換掉原本的圖騰? (y/n)');

    const filter = (m) => ['yes', 'y', 'no', 'n'].indexOf(m.content) !== -1 && m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 20000 });

    let done = false;

    collector.on('collect', async (m) => {
        done = true;
        collector.stop();
        if (m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'y') {
            const final = [0, 0, 0, 0, 0];
            for (let p = 0; p < 2; p++) {
                if (randomResult[p] === 1) {
                    final[0] = Math.ceil((buyrank + p) / 2);
                } else if (randomResult[p] === 2) {
                    final[1] = Math.ceil((buyrank + p) / 2);
                } else if (randomResult[p] === 3) {
                    final[2] = Math.ceil((buyrank + p) / 2);
                } else if (randomResult[p] === 4) {
                    final[3] = Math.ceil((buyrank + p) / 2);
                } else {
                    final[4] = Math.ceil((buyrank + p) / 2);
                }
            }
            await totem.findOneAndUpdate(
                { discordid: message.author.id },
                {
                    $set: {
                        rank: parseInt(buyrank, 10),
                        cooldownReduce: final[0],
                        investMulti: final[1],
                        commandCost: final[2],
                        giveTax: final[3],
                        doubleChance: final[4],
                    },
                },
            );
            return message.reply('已經保留 :sob: :thumbsup:');
        }

        return message.reply('已經丟棄 :joy:');
    });

    collector.on('end', () => {
        if (done === true) return;
        return message.reply('已經取消指令!');
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'gacha',
    description: '購買Totem',
    usage: 'gacha',
};
