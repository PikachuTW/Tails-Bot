const { codeBlock } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const logger = require('../modules/Logger.js');
const { settings } = require('../config.js');
const misc = require('../models/misc.js');
const version = require('../version.js');
const level = require('../models/level.js');
const giveaway = require('../models/giveaway');
const ticket = require('../models/ticket');

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
    }, 60000);

    setInterval(async () => {
        try {
            const now = Date.now();
            let res = await giveaway.find();
            res = res.filter((d) => d.users.length === 0).filter((d) => now > d.time);
            const data = res[0];
            const Channel = client.channels.cache.get(data.channelid);
            const msg = await Channel.messages.fetch(data.messageid);
            if (!msg || !Channel) {
                await giveaway.deleteOne({ messageid: data.messageid });
                return;
            }
            const reactUsers = msg.reactions.cache.get('931773626057912420').users.cache.map((u) => u.id).filter((i) => i !== '889358372170792970');
            if (reactUsers.length === 0) {
                Channel.send('沒有人參加抽獎 🐸');
                await giveaway.deleteOne({ messageid: data.messageid });
                return;
            }
            await giveaway.updateOne({ messageid: data.messageid }, { users: reactUsers });
            let winners = [];
            if (reactUsers.length <= data.winner) {
                winners = reactUsers;
            }
            while (winners.length < data.winner) {
                // eslint-disable-next-line no-await-in-loop
                const winUser = await client.users.fetch(reactUsers[Math.floor((Math.random() * reactUsers.length))]);
                if (winners.indexOf(winUser) === -1) {
                    winners.push(winUser);
                }
            }
            Channel.send(`恭喜 ${winners.join(' ')} 中獎 😭👏`);
        } catch {}
    }, 1000);

    setInterval(async () => {
        const list = await ticket.find();
        const channels = client.channels.cache;
        list.forEach(async (res) => {
            if (!res) return;
            if (!channels.get(res.channelid)) {
                await ticket.deleteOne({ channelid: res.channelid });
            }
        });
    }, 60000);
};
