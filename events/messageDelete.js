const { MessageEmbed } = require('discord.js');
const snipedata = require('../models/snipedata.js');
const misc = require('../models/misc.js');

module.exports = async (client, message) => {

    if (message.guildId != '828450904990154802') return;
    if (!message.author) return;

    const currentdate = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ format: 'png' }), url: message.url })
        .setDescription(message.content)
        .setImage(message.attachments.first() ? message.attachments.first().proxyURL : null)
        .setFooter({ text: `Author: ${message.author.id} | Message ID: ${message.id}\n${currentdate} | 頻道: ${message.channel.name}` });

    client.channels.cache.find(channel => channel.id === '932974877630148658').send({ embeds: [exampleEmbed] });

    if (message.channel.id == '857947371631804437') {
        const now = await misc.findOne({ 'key': 'countChannel' });
        if (message.content == now.value_num - 1) {
            client.channels.cache.find(channel => channel.id == '857947371631804437').send(`${message.author} ${message.content}`);
        }
    }

    if (message.author.bot) return;

    const data = await snipedata.findOne({ channelid: message.channel.id });
    if (!data) {
        await snipedata.create({
            channelid: message.channel.id,
            snipemsg: 'test',
            snipesender: 123,
            snipetime: 'test',
            snipeatt: 'test',
        });
    }

    if (message.author.id == '650604337000742934') {
        if (message.content.toLowerCase().startsWith('s?s')) {
            await snipedata.updateOne({ 'channelid': message.channel.id }, { $set: { 'snipemsg': '```已屏蔽```', 'snipetime': '屏蔽了🙈' } });
        }
        return;
    }
    if (message.content == 't!rs') return;

    await snipedata.updateOne({ 'channelid': message.channel.id }, { $set: { 'snipemsg': message.content, 'snipesender': message.author.id, 'snipetime': currentdate, 'snipeatt': message.attachments.first() ? message.attachments.first().proxyURL : null } });
};