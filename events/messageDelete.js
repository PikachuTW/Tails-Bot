const { MessageEmbed } = require('discord.js');
const snipedata = require('../models/snipedata.js');

module.exports = async (client, message) => {
    if (message.guildId !== '828450904990154802' || !message.author) return;

    const currentdate = new Date(message.createdTimestamp).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    client.channels.cache.get('932974877630148658').send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setAuthor({ name: message.author.tag, iconURL: message.member?.displayAvatarURL({ format: 'png', dynamic: true }) ? message.member.displayAvatarURL({ format: 'png', dynamic: true }) : null, url: message.url })
                .setDescription(`${message.content}\n${message.attachments.map((m) => m.proxyURL).join(' ')}`)
                .setImage(message.attachments.first() ? message.attachments.first().proxyURL : null)
                .setFooter({ text: `Author: ${message.author.id} | Message ID: ${message.id}\n${currentdate} | 頻道: ${message.channel.name}` }),
        ],
    });

    if (message.author.bot && message.author.tag) return;

    let data = await snipedata.findOne({ channelid: message.channel.id });
    if (!data) {
        data = await snipedata.create({
            channelid: message.channel.id,
            snipemsg: 'test',
            snipesender: 123,
            snipetime: 'test',
        });
    }

    if (message.author.id === '650604337000742934') {
        if (data.snipemsg !== '```已屏蔽```') {
            await snipedata.updateOne({
                channelid: message.channel.id,
            }, {
                $set: {
                    snipetime: currentdate,
                },
            });
        }
        return;
    }

    const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite', 't.me', 'lamtintinfree'];

    if (['t!rs', 's?s', 's?'].indexOf(message.content.toLowerCase()) !== -1 || bannedWords.some((word) => unescape(message.content.toLowerCase()).includes(word) || message.content.toLowerCase().includes(word))) return;

    await snipedata.updateOne({
        channelid: message.channel.id,
    }, {
        $set: {
            snipemsg: message.content,
            snipesender: message.author.id,
            snipetime: currentdate,
            snipeatt: message.attachments.size > 0 ? message.attachments.map((a) => a.proxyURL) : null,
        },
    });
};
