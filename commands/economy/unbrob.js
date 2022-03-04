const { MessageEmbed } = require('discord.js');
const { Client } = require('unb-api');
const unb = new Client(process.env.UNB);
const cooldown = require('../../models/cooldown.js');

exports.run = async (client, message, args) => {

    const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');

    if (message.author.id == target.id) {
        return message.reply('不可以搶自己的劫 :joy:');
    }

    const selfdata = await unb.getUserBalance('828450904990154802', message.author.id);

    const targetdata = await unb.getUserBalance('828450904990154802', target.id);

    if (targetdata.total == Infinity || selfdata.total == Infinity) {
        return message.reply('無限金錢者不能參與搶劫!!');
    }

    if (targetdata.cash < 0) {
        return message.reply('目標金錢小於0!');
    }

    if (selfdata.total < 0) {
        return message.reply('你的金錢小於0!');
    }

    let robcd = await cooldown.findOne({ discordid: message.author.id });
    if (!robcd) {
        robcd = await cooldown.create({
            discordid: message.author.id,
            robstamp: 0,
        });
    }

    if (Date.now() - robcd.robstamp < 30000) {
        return message.reply(`搶劫還在冷卻中! (${((30000 - (Date.now() - robcd['robstamp'])) / 1000).toPrecision(2)}秒) 😱`);
    }

    await cooldown.findOneAndUpdate({ 'discordid': message.author.id }, { $set: { 'robstamp': Date.now() } });

    if (Math.random() < (Math.abs(selfdata.total - targetdata.cash) / 2 + targetdata.cash / 2.5) / (selfdata.total + targetdata.cash)) {

        const loseembed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle('你搶失敗了 :joy: :pinching_hand:')
            .setDescription(`你以失敗率 \`${(((Math.abs(selfdata.total - targetdata.cash) / 2 + targetdata.cash / 2.5) / (selfdata.total + targetdata.cash)) * 100).toPrecision(2)}\` % 搶劫失敗了，被扣了 \`${new Intl.NumberFormat('en-US').format(Math.round(selfdata.total * (0.3 + Math.random() / 2)))}\` 林天天幣`)
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        message.reply({ embeds: [loseembed] });

        unb.editUserBalance('828450904990154802', message.author.id, { 'cash': selfdata.total * (0.3 + Math.random() / 2) * -1, 'bank': 0 }, 'rob lose');
    }
    else {
        const winembed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle('你搶成功了 :sob: :thumbsup:')
            .setDescription(`你以失敗率 \`${(((Math.abs(selfdata.total - targetdata.cash) / 2 + targetdata.cash / 2.5) / (selfdata.total + targetdata.cash)) * 100).toPrecision(2)}\` % 搶劫成功了，搶了 \`${new Intl.NumberFormat('en-US').format(Math.round(targetdata.cash * (0.4 + Math.random() / 2)))}\` 林天天幣`)
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        message.reply({ embeds: [winembed] });

        unb.editUserBalance('828450904990154802', message.author.id, { 'cash': targetdata.cash * (0.4 + Math.random() / 2), 'bank': 0 }, 'rob win');
        unb.editUserBalance('828450904990154802', target.id, { 'cash': targetdata.cash * (0.4 + Math.random() / 2) * -1, 'bank': 0 }, 'get robbed');
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['rob'],
    permLevel: 'User',
};

exports.help = {
    name: 'unbrob',
    description: '偷他人的林天天幣',
    usage: 'unbrob',
};