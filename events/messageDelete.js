const { MessageEmbed } = require('discord.js');
const snipe = require('../models/snipe.js');
const imageSaveMap = require('../imageSaveMap.js');

module.exports = async (client, message) => {
    if (message.guildId !== '828450904990154802' || !message.author) return;

    const currentdate = new Date(message.createdTimestamp).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    if (!message.content && (!message.attachments || message.attachments.size === 0)) return;

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

    if (message.author.bot || !message.author.tag) return;

    const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite', 't.me', 'lamtintinfree'];

    if (message.content.toLowerCase().startsWith('t!rs') || ['s?s', 's?'].includes(message.content.toLowerCase()) || bannedWords.some((word) => decodeURIComponent(message.content.toLowerCase()).includes(word) || message.content.toLowerCase().includes(word))) return;

    if (['650604337000742934', '962270937665896478'].includes(message.author.id)) return;

    let mc = message.content;
    if (message.stickers.first()) {
        mc += `\n[貼圖: ${message.stickers.first().name}]`;
    }

    let snipesender = message.author.tag;
    const [name, tagNumber] = snipesender.split('#');
    if (tagNumber === '0') {
        snipesender = name;
    }

    const res = await snipe.findOne({ channelid: message.channel.id });
    if (!res) {
        await snipe.create({
            channelid: message.channel.id,
            snipemsg: mc,
            snipesender,
            snipetime: currentdate,
            snipeatt: message.attachments.size > 0 ? message.attachments.map((a) => a.url) : message.stickers.size > 0 ? message.stickers.map((a) => a.url) : null,
        });
    } else {
        await snipe.updateOne({ channelid: message.channel.id }, {
            $set: {
                snipemsg: mc,
                snipesender,
                snipetime: currentdate,
                snipeatt: message.attachments.size > 0 ? message.attachments.map((a) => imageSaveMap.get(a.url)) : message.stickers.size > 0 ? message.stickers.map((a) => a.url) : null,
            },
        });
    }
};
