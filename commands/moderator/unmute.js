const { MessageEmbed } = require('discord.js');
const totem = require('../../models/totem.js');
const { benefitsdata } = require('../../config.js');
const credit = require('../../models/credit.js');

exports.run = async (client, message, args) => {

    const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以解除禁言他 :weary:');

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
    const milliseconds = target.communicationDisabledUntilTimestamp - Date.now();

    if (message.author.id != '650604337000742934' && milliseconds > 600000) {
        if (before < Math.round((milliseconds / 1000) - 600 * benefitsdata.commandCost[totemdata.commandCost])) {
            return message.reply(`你需要 \`${Math.round((milliseconds / 1000) - 600 * benefitsdata.commandCost[totemdata.commandCost])}\` Tails幣才能unmute此用戶 <:frog4:931773626057912420>`);
        }
        else {
            await credit.findOneAndUpdate({ 'discordid': message.author.id }, { $inc: { 'tails_credit': -1 * Math.round((milliseconds / 1000) - 600 * benefitsdata.commandCost[totemdata.commandCost]) } });
        }
    }

    target.timeout(null, `${message.author.username}#${message.author.discriminator}`);

    message.reply(`${target.user.username}#${target.user.discriminator} 已經被解除禁言!`);

    const kickEmbed = new MessageEmbed()
        .setTitle('你已經被解除禁言!')
        .setColor('#ffae00')
        .setDescription('你被解除禁言了')
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    target.send({ embeds: [kickEmbed] });
    const ReasonEmbed = new MessageEmbed()
        .setTitle('成員已被解除禁言!')
        .setColor('#ffae00')
        .addField('成員', `${target}`, false)
        .addField('管理者', `${message.author}`, false)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({ embeds: [ReasonEmbed] });
    client.channels.cache.find(channel => channel.id === '907969972893020201').send({ embeds: [ReasonEmbed] });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Staff',
};

exports.help = {
    name: 'unmute',
    category: '管理',
    description: '解除禁言成員',
    usage: 'unmute <@成員>',
};