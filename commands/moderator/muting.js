const { MessageEmbed } = require('discord.js');
const timeFormat = require('../../modules/functions.js');

exports.run = async (client, message) => {
    const now = Date.now();
    const res = message.guild.members.cache.filter((m) => m.communicationDisabledUntilTimestamp - now > 0);
    let msg;
    if (res.size === 0) {
        msg = '```無```';
    } else {
        msg = res.map((m) => `${m} \`${timeFormat(m.communicationDisabledUntilTimestamp - now, true)}\``).join('\n');
    }
    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('目前正在禁言成員名單')
                .setDescription(msg)
                .setColor('#ffae00'),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '查看正在被禁言的成員',
};
