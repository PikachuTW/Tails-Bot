const { codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');
const RssFeedEmitter = require('rss-feed-emitter');
const logger = require('../modules/Logger.js');
const { settings } = require('../config.js');
const misc = require('../models/misc.js');
const version = require('../version.js');
const level = require('../models/level.js');

const feeder = new RssFeedEmitter({ skipFirstLoad: true });

module.exports = async (client) => {
    logger.log(`${client.user.tag}, 成員數: ${client.guilds.cache.map((g) => g.memberCount).reduce((a, b) => a + b)} ，伺服器數: ${client.guilds.cache.size}`, 'ready');
    client.user.setActivity(`${settings.prefix}help | Made By Tails`, { type: 'PLAYING' });
    // client.channels.cache.find(c => c.id == '948178858610405426').send('機器人已經重新開機!');
    const versionDate = await misc.findOne({ key: 'version' });
    if (version.number !== versionDate.value_string) {
        const Embed1 = new MessageEmbed()
            .setColor('#ffae00')
            .setDescription(`${codeBlock('fix', version.number)}${codeBlock('ini', `[${version.tag}]`)}${codeBlock('md', version.description)}`);

        client.channels.cache.find((channel) => channel.id === '940544564257763359').send({ content: `${version.important} 機器人 ${version.number} 更新`, embeds: [Embed1] });
        await misc.findOneAndUpdate({ key: 'version' }, { $set: { value_string: version.number } });
    }

    const targetGuild = client.guilds.cache.find((guild) => guild.id === '828450904990154802');

    setInterval(() => {
        const count = targetGuild.memberCount;
        client.channels.cache.find((channel) => channel.id === '897054056625885214').setName(`成員數:${count}`);
        client.channels.cache.find((channel) => channel.id === '898168354680995880').send(`成員數:${count}`);
    }, 300000);

    setInterval(async () => {
        if (targetGuild.me.voice.channelId === '858370818635464774' && targetGuild.me.voice.channel.members.map((m) => m).length === 1) {
            getVoiceConnection('828450904990154802').destroy();
            client.channels.cache.find((c) => c.id === '948178858610405426').send('因為無人在語音頻道，機器人已斷開連線');
        }
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);
        const activeLevelData = await level.find({ discordid: { $in: targetGuild.members.cache.filter((member) => member.roles.cache.find((role) => role.id === '856808847251734559')).map((m) => m.id) } });
        activeLevelData.forEach((data) => {
            if (data.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0) <= 100) {
                targetGuild.members.cache.find((user) => user.id === data.discordid).roles.remove('856808847251734559');
            }
        });
        const sActiveLevelData = await level.find({ discordid: { $in: targetGuild.members.cache.filter((member) => member.roles.cache.find((role) => role.id === '861459068789850172')).map((m) => m.id) } });
        sActiveLevelData.forEach((data) => {
            if (data.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0) <= 300) {
                targetGuild.members.cache.find((user) => user.id === data.discordid).roles.remove('861459068789850172');
            }
        });
    }, 120000);

    feeder.add({
        url: [
            'https://news.ltn.com.tw/rss/politics.xml',
            'https://news.ltn.com.tw/rss/opinion.xml',
            'https://www.epochtimes.com/gb/nsc413.xml',
            'https://news.pts.org.tw/xml/newsfeed.xml',
            'http://www.people.com.cn/rss/politics.xml',
            'http://www.people.com.cn/rss/haixia.xml',
            'http://www.people.com.cn/rss/military.xml',
            'http://www.people.com.cn/rss/world.xml',
            'https://m.secretchina.com/news/gb/p1.xml',
            'https://m.secretchina.com/news/gb/p2.xml',
            'https://www.cdc.gov.tw/RSS/RssXml/Hh094B49-DRwe2RR4eFfrQ?type=1',
        ],
        refresh: 2000,
    });

    feeder.on('new-item', (item) => {
        try {
            client.channels.cache.get('962232054878187530').send(
                `**${item.title}**\n${item.link}`,
            );
        } catch (e) {
            logger.error(e);
        }
    });
};
