const { MessageEmbed } = require('discord.js');
const { ObjectId } = require('mongodb');
const warning = require('../../models/warning.js');

exports.run = async (client, message, args) => {
    const id = args[0];
    if (!id) return message.reply('請提供一個有效ID');

    const res = await warning.findOne({ _id: ObjectId(args[0]) });

    if (!res) return message.reply('沒有這個警告');

    await warning.deleteOne({ _id: ObjectId(args[0]) });

    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(`**已經刪除由 <@${res.warnstaff}> 記的警告 (警告原因: ${res.warncontent})**`),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Highest',
    description: '刪除成員的警告',
};
