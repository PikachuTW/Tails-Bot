const { MessageEmbed } = require('discord.js');
const invest = require('../../models/invest.js');

exports.run = async (client, message, args) => {

    const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[0]) || message.member;
    if (!target) return message.reply('請給予有效目標!');

    let data = await invest.findOne({ discordid: target.id });
    if (!data) {
        await invest.create({
            discordid: target.id,
            savedata: 0,
            claimcooldown: 0,
        });
        data = await invest.findOne({ discordid: target.id });
    }

    const price = [20, 50, 120, 200, 400, 750, 1250, 2500, 4000, 6000, 10000, 15000,
    ];

    const payout = [1, 2, 4, 6, 8, 12, 16, 25, 36, 45, 66, 90,
    ];

    let re = '';

    let i, p;

    const judge = new Array(12);

    let savething = data['savedata'];

    if (savething != 0) {
        for (i = 11; i >= 0; i--) {
            if (savething >= Math.pow(2, i)) {
                savething -= Math.pow(2, i);
                judge[i] = true;
            }
            else {
                judge[i] = false;
            }
        }
    }
    else {
        for (i = 11; i >= 0; i--) {
            judge[i] = false;
        }
    }

    for (p = 0; p <= 11; p++) {
        re = re + `\`${p + 1}\` ` + '價錢' + price[p] + ' ' + '出資' + payout[p] + ' ';
        if (judge[p] == true) {
            re += '`已經購買✅`\n';
        }
        else {
            re += '`尚未購買❌`\n';
        }
    }

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${target.user.tag} 的Tails幣投資系統狀態`)
        .setDescription(re)
        .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'invest',
    description: '查看你的資金投資列表',
    usage: 'invest',
};