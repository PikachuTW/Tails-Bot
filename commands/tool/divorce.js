const { MessageEmbed } = require('discord.js');
const marry = require('../../models/marry.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;
    const res = await marry.findOne({ users: target.id });
    if (!res) {
        message.reply('你並沒有任何婚姻!');
    } else {
        const man = message.guild.members.cache.get(res.users[0]);
        const woman = message.guild.members.cache.get(res.users[1]);
        await marry.deleteOne({ users: target.id });
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${man} 已經與 ${woman} 離婚`),
            ],
        });
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '結婚',
};
