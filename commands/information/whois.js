const { MessageEmbed } = require('discord.js');
const Mee6LevelsApi = require('mee6-levels-api');
const { Client } = require('unb-api');
const unb = new Client(process.env.UNB);
const { millify } = require('millify');
const credit = require('../../models/credit.js');
const introduction = require('../../models/introduction.js');

exports.run = async (client, message, args) => {
    const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');

    const mee6data = await Mee6LevelsApi.getUserXp('828450904990154802', target.id);

    const unbdata = await unb.getUserBalance('828450904990154802', target.id);

    let creditdata = await credit.findOne({ discordid: target.id });

    if (!creditdata) {
        await credit.create({
            discordid: target.id,
            tails_credit: 0,
        });
        creditdata = await credit.findOne({ discordid: target.id });
    }

    let introdata = await introduction.findOne({ discordid: target.id });

    if (!introdata) {
        await introduction.create({
            discordid: target.id,
            intro: '無',
        });
        introdata = await introduction.findOne({ discordid: target.id });
    }

    const creditrank = await credit.find({ 'tails_credit': { $gte: creditdata.tails_credit } });

    const tcdata = creditdata.tails_credit == Infinity ? Infinity : millify(creditdata.tails_credit);

    const lttdata = unbdata.total == Infinity ? Infinity : millify(unbdata.total);

    if (!mee6data) {
        const exampleEmbed = new MessageEmbed()
            .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL({ format: 'png', dynamic: true }) })
            .setDescription(`<@${target.id}>`)
            .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
            .addField('加入日期', `\`\`\`${target.joinedAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
            .addField('創建日期', `\`\`\`${target.user.createdAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
            // .addField('\u200B', '\u200B', true)
            .addField('林天天幣', `\`\`\`${lttdata}\`\`\``, true)
            .addField('林天天幣排名', `\`\`\`${unbdata.rank}\`\`\``, true)
            .addField('Tails幣', `\`\`\`${tcdata}\`\`\``, true)
            .addField('Tails幣排名', `\`\`\`${creditrank.length}\`\`\``, true)
            .addField('自我介紹', `\`\`\`${introdata.intro}\`\`\``)
            .addField(`身分組 [${target.roles.cache.filter((roles) => roles.id !== message.guild.id).size}]`, `${target.roles.cache.filter((roles) => roles.id !== message.guild.id).sort((a, b) => b.rawPosition - a.rawPosition).map((role) => role.toString()).join(' ')}`)
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        return message.reply({ embeds: [exampleEmbed] });
    }


    const exampleEmbed = new MessageEmbed()
        .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL({ format: 'png', dynamic: true }) })
        .setDescription(`<@${target.id}>`)
        .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField('加入日期', `\`\`\`${target.joinedAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
        .addField('創建日期', `\`\`\`${target.user.createdAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
        // .addField('\u200B', '\u200B', true)
        .addField('Mee6等級', `\`\`\`${mee6data.level}\`\`\``, true)
        .addField('Mee6總Xp數', `\`\`\`${mee6data.xp.totalXp}\`\`\``, true)
        .addField('Mee6排名', `\`\`\`${mee6data.rank}\`\`\``, true)
        .addField('林天天幣', `\`\`\`${lttdata}\`\`\``, true)
        .addField('林天天幣排名', `\`\`\`${unbdata.rank}\`\`\``, true)
        .addField('Tails幣', `\`\`\`${tcdata}\`\`\``, true)
        .addField('Tails幣排名', `\`\`\`${creditrank.length}\`\`\``, true)
        .addField('自我介紹', `\`\`\`${introdata.intro}\`\`\``)
        .addField(`身分組 [${target.roles.cache.filter((roles) => roles.id !== message.guild.id).size}]`, `${target.roles.cache.filter((roles) => roles.id !== message.guild.id).sort((a, b) => b.rawPosition - a.rawPosition).map((role) => role.toString()).join(' ')}`)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [exampleEmbed] });

};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['profile'],
    permLevel: 'User',
};

exports.help = {
    name: 'whois',
    category: '資訊',
    description: '獲取成員的數據',
    usage: 'whois',
};