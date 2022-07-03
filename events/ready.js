/* eslint-disable no-underscore-dangle */
const { codeBlock } = require('@discordjs/builders');
const QuickChart = require('quickchart-js');
const { MessageEmbed, MessageAttachment } = require('discord.js');
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

        client.channels.cache.get('940544564257763359').send({ content: `${version.important} 機器人 ${version.number} 更新`, embeds: [Embed1] });
        await misc.findOneAndUpdate({ key: 'version' }, { $set: { value_string: version.number } });
    }

    const targetGuild = client.guilds.cache.find((guild) => guild.id === '828450904990154802');

    setInterval(() => {
        const count = targetGuild.memberCount;
        client.channels.cache.get('897054056625885214').setName(`成員數:${count}`);
        client.channels.cache.get('898168354680995880').send(`成員數:${count}`);
    }, 300000);

    setInterval(async () => {
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);
        const activeLevelData = await level.find({ discordid: { $in: targetGuild.roles.cache.get('856808847251734559').members.cache.map((m) => m.id) } });
        activeLevelData.forEach(async (data) => {
            if (data.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0) <= 100) {
                const m = targetGuild.members.cache.get(data.discordid);
                if (m) {
                    m.roles.remove('856808847251734559');
                }
            }
        });
        const sActiveLevelData = await level.find({ discordid: { $in: targetGuild.roles.cache.get('861459068789850172').members.cache.map((m) => m.id) } });
        sActiveLevelData.forEach(async (data) => {
            if (data.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0) <= 300) {
                const m = targetGuild.members.cache.get(data.discordid);
                if (m) {
                    m.roles.remove('861459068789850172');
                }
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

    setInterval(async () => {
        const Guild = client.guilds.resolve('828450904990154802');
        const Message = await Guild.channels.resolve('984704596591128616').messages.fetch('984706929337184337');
        if (!Message) return;
        const tier = Guild.premiumTier;
        let banCount = await Guild.bans.fetch();
        banCount = banCount.size;
        const serverInfoEmbed = new MessageEmbed()
            .setTitle(Guild.name)
            .setColor('#ffae00')
            .setDescription(
                `**ID:** \`${Guild.id}\`
                    **Owner:** <@${Guild.ownerId}>
                    **創建時間:** <t:${Math.round(Guild.createdTimestamp / 1000)}>
                    **人數:** \`${Guild.memberCount}\`
                    **加成:** 等級 \`${tier === 'TIER_1' ? 1 : tier === 'TIER_2' ? 2 : tier === 'TIER_3' ? 3 : '無'}\` 加成數 \`${Guild.premiumSubscriptionCount}\`

                    **身分組數:** \`${Guild.roles.cache.size}\`
                    **頻道數:** \`${Guild.channels.channelCountWithoutThreads}\`
                    **表情數:** \`${Guild.emojis.cache.size}\`
                    **封鎖數:** \`${banCount}\``,
            )
            .setThumbnail(Guild.iconURL({ dynamic: true, format: 'png' }));

        const all = Guild.roles.resolve('832213672695693312').members;
        const staff = all.filter((member) => !member.roles.cache.has('856377783163944970') && !member.roles.cache.has('870741338960830544'));
        const admin = all.filter((member) => !member.roles.cache.has('870741338960830544') && member.roles.cache.has('856377783163944970'));
        const owner = all.filter((member) => member.roles.cache.find((role) => role.id === '870741338960830544'));
        const staffEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle('管理人員階級列表')
            .setDescription(`**群主OWNER**\n${owner.size > 0 ? `${owner.map((member) => member.user).join('\n')}\n` : '```無```\n'}**管理員ADMIN**\n${admin.size > 0 ? `${admin.map((member) => member.user).join('\n')}\n` : '```無```\n'}**管理人員STAFF**\n${staff.size > 0 ? `${staff.map((member) => member.user).join('\n')}\n` : '```無```\n'}`);

        const activeRole = Guild.roles.cache.get('856808847251734559');
        const activeEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`活躍成員清單 (近三天100則訊息) (${activeRole.members.size}個)`)
            .setDescription(activeRole.members.map((d) => d).join('\n'));

        const sActiveRole = Guild.roles.cache.get('861459068789850172');
        const sActiveEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`超級活躍成員清單 (近兩天300則訊息) (${sActiveRole.members.size}個)`)
            .setDescription(sActiveRole.members.map((d) => d).join('\n'))
            .setFooter({ text: `最後編輯時間 ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}` });

        const res = await level.aggregate([
            { $unwind: '$daily' },
            {
                $group: {
                    _id: '$discordid',
                    total: { $sum: '$daily.count' },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 10 },
        ]);

        const chartRes = await level.aggregate([
            { $unwind: '$daily' },
            {
                $group: {
                    _id: '$daily.date',
                    total: { $sum: '$daily.count' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        const chart = new QuickChart();

        chart.setWidth(500);
        chart.setHeight(300);

        chart.setConfig({
            type: 'line',
            data: {
                labels: chartRes.map((d) => `${new Date((d._id) * 86400000).getMonth() + 1}/${new Date((d._id) * 86400000).getDate()}(${weekDays[new Date((d._id) * 86400000).getDay()]})`),
                datasets: [{
                    label: '訊息量',
                    fill: false,
                    borderColor: '#ffae00',
                    pointBackgroundColor: '#ffae00',
                    data: chartRes.map((d) => d.total),
                }],
            },
            options: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: '伺服器訊息資料圖表',
                },
            },
        });

        const imageGen = new MessageAttachment(chart.getUrl(), 'server_chart.png');

        let co = '';

        for (let i = 0; i < 10; i++) {
            co += `\`${i + 1}\` <@${res[i]._id}> **${res[i].total}**\n`;
        }

        const totalLbEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle('總訊息量前十排行榜')
            .setDescription(co)
            .setThumbnail('https://i.imgur.com/MTWQbeh.png')
            .setImage('attachment://server_chart.png');

        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);

        const ares = await level.aggregate([
            { $unwind: '$daily' },
            { $match: { 'daily.date': { $gte: nowStamp - 2 } } },
            {
                $group: {
                    _id: '$discordid',
                    total: { $sum: '$daily.count' },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 10 },
        ]);

        let aco = '';

        for (let i = 0; i < 10; i++) {
        // eslint-disable-next-line no-underscore-dangle
            aco += `\`${i + 1}\` <@${ares[i]._id}> **${ares[i].total}**\n`;
        }

        const activeLbEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle('三日內訊息量前十排行榜')
            .setDescription(aco)
            .setThumbnail('https://i.imgur.com/MTWQbeh.png');

        await Message.edit({
            content: null,
            embeds: [serverInfoEmbed, staffEmbed, totalLbEmbed, activeLbEmbed, activeEmbed, sActiveEmbed],
            files: [imageGen],
        });
    }, 60000);
};
