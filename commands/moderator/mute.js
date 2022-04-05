const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const totem = require('../../models/totem.js');
const { benefitsdata } = require('../../config.js');
const credit = require('../../models/credit.js');

exports.run = async (client, message, args) => {
    const target = message.mentions.members.first() || message.guild.members.cache.find((member) => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');
    const time = args[1];
    const reason = args.slice(2).join(' ');
    if (!time) return message.reply('請提供時間');
    if (!reason) return message.reply('請提供原因!');
    if (target.communicationDisabledUntilTimestamp - Date.now() > 0) return message.reply('此用戶早就已經被禁言了! :joy:');
    const milliseconds = ms(time);

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以禁言他 :weary:');

    if (!milliseconds || milliseconds < 10000 || milliseconds > 2419200000) {
        return message.reply('請給出 10s-28d 的時間');
    }

    let data = await credit.findOne({ discordid: message.author.id });
    if (!data) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
        data = await credit.findOne({ discordid: message.author.id });
    }

    let totemdata = await totem.findOne({ discordid: message.author.id });
    if (!totemdata) {
        await totem.create({
            discordid: message.author.id,
            rank: 0,
            cooldownReduce: 0,
            investMulti: 0,
            commandCost: 0,
            giveTax: 0,
            doubleChance: 0,
        });
        totemdata = await totem.findOne({ discordid: message.author.id });
    }

    const before = data.tails_credit;

    if (message.author.id !== '650604337000742934' && milliseconds > 600000) {
        if (before < Math.round((milliseconds / 1000) - 600 * benefitsdata.commandCost[totemdata.commandCost])) {
            return message.reply(`你需要 \`${Math.round((milliseconds / 1000) - 600 * benefitsdata.commandCost[totemdata.commandCost])}\` Tails幣才能mute此用戶 <:frog4:931773626057912420>`);
        }

        await credit.findOneAndUpdate({ discordid: message.author.id }, { $inc: { tails_credit: -1 * Math.round((milliseconds / 1000) - 600 * benefitsdata.commandCost[totemdata.commandCost]) } });
    }

    target.timeout(milliseconds, `${message.author.username}#${message.author.discriminator} - ${reason}`);

    message.reply(`${target.user.username}#${target.user.discriminator} 已經被禁言 ${ms(ms(time), { long: true })} !`);

    // message
    const kickEmbed = new MessageEmbed()
        .setTitle('你已經被禁言!')
        .setColor('#ffae00')
        .setDescription(`你被禁言了 ${ms(ms(time), { long: true })}\n原因: ${reason}\n管理者:${message.author}`)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    target.send({ embeds: [kickEmbed] });
    const ReasonEmbed = new MessageEmbed()
        .setTitle('成員已被禁言!')
        .setColor('#ffae00')
        .addField('成員', `${target}`, false)
        .addField('時間', `${ms(ms(time), { long: true })}`, false)
        .addField('原因', `${reason}`, false)
        .addField('管理者', `${message.author}`, false)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({ embeds: [ReasonEmbed] });
    client.channels.cache.find((channel) => channel.id === '907969972893020201').send({ embeds: [ReasonEmbed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '禁言成員',
    usage: 'mute <@成員> <時間> <原因>',
};
