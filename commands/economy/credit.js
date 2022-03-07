const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {

    const target = targetGet(message, args) || message.member;

    let data = await credit.findOne({ discordid: target.id });
    if (!data) {
        await credit.create({
            discordid: target.id,
            tails_credit: 0,
        });
        data = await credit.findOne({ discordid: target.id });
    }

    if (data.tails_credit < 0) {
        await credit.findOneAndUpdate({ 'discordid': target.id }, { $set: { 'tails_credit': 0 } });
    }

    const creditrank = await credit.find({ 'tails_credit': { $gte: data.tails_credit } });

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${target.user.tag} 的Tails幣餘額`)
        .setDescription(`餘額: \`${data.tails_credit}\`\n排名: \`${creditrank.length}\``)
        .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['bal'],
    permLevel: 'User',
};

exports.help = {
    name: 'credit',
    description: '查看你的Tails幣餘額',
    usage: 'credit',
};