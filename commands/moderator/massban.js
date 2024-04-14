const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const targets = args.map((k) => k.slice(2, -1));

    targets.forEach((k) => {
        message.guild.bans.create(k, { reason: `${message.author.newName} mass ban` });
    });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('大量成員已被禁止!')
                .setColor('#ffae00')
                .setDescription(`<@${targets.join('> <@')}>`)
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '大量禁止成員',
};
