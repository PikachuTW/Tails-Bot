const { MessageEmbed } = require('discord.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');

    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply('你的身分組沒有比他高欸!你怎麼可以解除禁言他 :weary:');

    target.timeout(null, `${message.author.username}#${message.author.discriminator}`);

    const ReasonEmbed = new MessageEmbed()
        .setTitle('成員已被解除禁言!')
        .setColor('#ffae00')
        .addFields([
            { name: '成員', value: `${target}`, inline: false },
            { name: '管理者', value: `${message.author}`, inline: false },
        ])
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({ embeds: [ReasonEmbed] });
    client.channels.resolve('907969972893020201').send({ embeds: [ReasonEmbed] });

    target.send({
        embeds: [
            new MessageEmbed()
                .setTitle('你已經被解除禁言!')
                .setColor('#ffae00')
                .setDescription('你被解除禁言了')
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' })],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '解除禁言成員',
};
