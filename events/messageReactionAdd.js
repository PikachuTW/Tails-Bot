const { MessageEmbed } = require('discord.js');
const misc = require('../models/misc.js');

module.exports = async (client, messageReaction, user) => {
    const { message } = messageReaction;
    await message.fetch();
    if (user.id !== '650604337000742934' || message.channel.id !== '1088875867926695967' || messageReaction.emoji.name !== '✅') return;
    const text = message.content.slice(message.content.indexOf('`'));
    const { value_num } = await misc.findOneAndUpdate({ key: 'cb' }, { $inc: { value_num: 1 } });
    client.channels.cache.get('1088875215095869515').send({
        content: `#靠北林天天${value_num}`,
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(text),
        ],
    });
};
