const logger = require('../modules/Logger.js');
const { settings } = require('../config.js');
const misc = require('../models/misc.js');
const version = require('../version.js');
const { codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const level = require('../models/level.js');

module.exports = async client => {
    logger.log(`${client.user.tag}, 成員數: ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} ，伺服器數: ${client.guilds.cache.size}`, 'ready');

    client.user.setActivity(`${settings.prefix}help | Made By Tails`, { type: 'PLAYING' });

    const versionDate = await misc.findOne({ 'key': 'version' });
    if (version.number != versionDate.value_string) {
        const Embed1 = new MessageEmbed()
            .setColor('#ffae00')
            .setDescription(`${codeBlock('fix', version.number)}${codeBlock('ini', `[${version.tag}]`)}${codeBlock('md', version.description)}`);

        client.channels.cache.find(channel => channel.id == '940544564257763359').send({ content: `${version.important} 機器人 ${version.number} 更新`, embeds: [Embed1] });
        await misc.findOneAndUpdate({ 'key': 'version' }, { $set: { 'value_string': version.number } });
    }

    const targetGuild = client.guilds.cache.find(guild => guild.id == '828450904990154802');

    setInterval(() => {
        const count = targetGuild.memberCount;
        client.channels.cache.find(channel => channel.id === '897054056625885214').setName(`成員數:${count}`);
        client.channels.cache.find(channel => channel.id === '898168354680995880').send(`成員數:${count}`);
    }, 300000);

    setInterval(async () => {
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);
        const active_levelData = await level.find({ 'discordid': { $in: targetGuild.members.cache.filter(member => member.roles.cache.find(role => role.id == '856808847251734559')).map(m => m.id) } });
        for (const data of active_levelData) {
            if (data.daily.filter(d => d.date >= nowStamp - 2).map(d => d.count).reduce((a, b) => a + b, 0) <= 100) {
                targetGuild.members.cache.find(user => user.id == data.discordid).roles.remove('856808847251734559');
            }
        }
        const s_active_levelData = await level.find({ 'discordid': { $in: targetGuild.members.cache.filter(member => member.roles.cache.find(role => role.id == '861459068789850172')).map(m => m.id) } });
        for (const data of s_active_levelData) {
            if (data.daily.filter(d => d.date >= nowStamp - 1).map(d => d.count).reduce((a, b) => a + b, 0) <= 300) {
                targetGuild.members.cache.find(user => user.id == data.discordid).roles.remove('861459068789850172');
            }
        }
    }, 600000);
};