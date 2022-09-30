/* eslint-disable no-underscore-dangle */
const { codeBlock } = require('@discordjs/builders');
const QuickChart = require('quickchart-js');
const {
    MessageEmbed, MessageAttachment, MessageActionRow, MessageSelectMenu, MessageButton,
} = require('discord.js');
const { readdirSync } = require('fs');
const logger = require('../modules/Logger.js');
const { settings } = require('../config.js');
const misc = require('../models/misc.js');
const version = require('../version.js');
const level = require('../models/level.js');
const giveaway = require('../models/giveaway');
const ticket = require('../models/ticket');
const vote = require('../models/vote');
const drop = require('../models/drop');
const { getRandomNum } = require('../modules/functions.js');

module.exports = async (client) => {
    logger.log(`${client.user.tag}, 成員數: ${client.guilds.cache.map((g) => g.memberCount).reduce((a, b) => a + b, 0)} ，伺服器數: ${client.guilds.cache.size}`, 'ready');
    client.user.setActivity(`${settings.prefix}help | Made By Tails`, { type: 'PLAYING' });
    const versionDate = await misc.findOne({ key: 'version' });
    if (version.number !== versionDate.value_string) {
        const Embed1 = new MessageEmbed()
            .setColor('#ffae00')
            .setDescription(`${codeBlock('fix', version.number)}${codeBlock('ini', `[${version.tag}]`)}${codeBlock('md', version.description)}`);

        client.channels.cache.get('940544564257763359').send({ content: `${version.important} 機器人 ${version.number} 更新`, embeds: [Embed1] });
        await misc.findOneAndUpdate({ key: 'version' }, { $set: { value_string: version.number } });
    }

    const catList = new Map([
        ['economy', '經濟'],
        ['information', '資訊'],
        ['message', '訊息'],
        ['moderator', '管理'],
        ['music', '音樂'],
        ['system', '系統'],
        ['tool', '工具'],
        ['misc', '雜項'],
    ]);

    const helpEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('指令列表')
        .setThumbnail('https://i.imgur.com/MTWQbeh.png')
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    const folders = readdirSync('./commands/');
    folders.forEach((folder) => {
        const cmds = readdirSync(`./commands/${folder}/`).filter((file) => file.endsWith('.js'));
        let res = '';
        cmds.forEach((file) => {
            try {
                res += `\`t!${file.split('.')[0]}\` `;
            } catch (error) {
                logger.log(`${error}`, 'error');
            }
        });
        helpEmbed.addField(`${catList.get(folder)}`, res);
    });

    // eslint-disable-next-line no-param-reassign
    client.preload = {
        helpEmbed,
    };

    const targetGuild = client.guilds.cache.get('828450904990154802');

    setInterval(() => {
        const count = targetGuild.memberCount;
        client.channels.cache.get('897054056625885214').setName(`成員數:${count}`);
        client.channels.cache.get('898168354680995880').send(`成員數:${count}`);
    }, 300000);

    setInterval(async () => {
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);
        const activeLevelData = await level.find({ discordid: { $in: targetGuild.roles.cache.get('856808847251734559').members.map((m) => m.id) } });
        activeLevelData.forEach(async (data) => {
            const count = data.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0);
            if (count < 100) {
                const m = targetGuild.members.cache.get(data.discordid);
                if (m) {
                    m.roles.remove('856808847251734559');
                }
            }
            if (count < 200) {
                const m = targetGuild.members.cache.get(data.discordid);
                if (m) {
                    m.roles.remove('1014857925107392522');
                }
            }
        });
        const sActiveLevelData = await level.find({ discordid: { $in: targetGuild.roles.cache.get('861459068789850172').members.map((m) => m.id) } });
        sActiveLevelData.forEach(async (data) => {
            if (data.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0) < 250) {
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
            const get = await vote.find();
            get.filter((d) => now > d.time && !d.finished).forEach(async (res) => {
                await vote.updateOne({ msg: res.msg }, { finished: true });
                let highest = [];
                let max = 0;
                res.candidates.forEach((d) => {
                    const arr = res.data.filter((k) => k.candidate === d);
                    if (arr.length === max) {
                        highest.push(d);
                    } else if (arr.length > max) {
                        highest = [d];
                        max = arr.length;
                    }
                });
                const Channel = client.channels.cache.get(res.channel);
                Channel.send(`恭喜 ${highest.map((k) => Channel.guild.members.cache.get(k)).join(' ')} 當選`);
            });
        } catch {}
    }, 1000);

    setInterval(async () => {
        try {
            const now = Date.now();
            const get = await vote.find();
            get.filter((d) => now < d.time && !d.finished).forEach(async (res) => {
                const Channel = client.channels.cache.get(res.channel);
                const Message = await Channel.messages.fetch(res.msg);
                const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯'];
                const Embed = new MessageEmbed()
                    .setTitle(`${res.title}`)
                    .setColor('#ffae00');
                let i = 0;
                const selectList = [];
                let highest = [];
                let max = 0;
                let str = '';
                res.candidates.forEach((d) => {
                    const arr = res.data.filter((k) => k.candidate === d);
                    str += `${emojis[i]} ${Message.guild.members.cache.get(d)} (${arr.length}票)\n`;
                    if (arr.length === max) {
                        highest.push(d);
                    } else if (arr.length > max) {
                        highest = [d];
                        max = arr.length;
                    }
                    selectList.push({
                        label: Message.guild.members.cache.get(d).user.tag,
                        value: d,
                        emoji: emojis[i],
                    });
                    i += 1;
                });
                Embed.setDescription(`最高票: ${highest.map((k) => Message.guild.members.cache.get(k)).join(' ')}\n結束時間: <t:${Math.round(res.time / 1000)}> <t:${Math.round(res.time / 1000)}:R>\n\n${str}`);
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('voteSelect')
                            .setPlaceholder('投票區 Election Area')
                            .addOptions(selectList),
                    );
                await Message.edit({ embeds: [Embed], components: [row] });
            });
        } catch {}
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

        const nActiveRole = Guild.roles.cache.get('1014857925107392522');
        const nActiveEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`中等活躍成員清單 (近三天250則訊息) (${nActiveRole.members.size}個)`)
            .setDescription(nActiveRole.members.map((d) => d).join('\n'))
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
            embeds: [serverInfoEmbed, staffEmbed, totalLbEmbed, activeLbEmbed, activeEmbed, nActiveEmbed, sActiveEmbed],
            files: [imageGen],
        });
    }, 60000);

    const dropF = async () => {
        const res = await drop.findOneAndDelete({});
        const Channel = client.channels.cache.get('948178858610405426');
        const Message = await Channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription('**隨機Tails Credits獎勵!**'),
            ],
            components: [
                new MessageActionRow()
                    .setComponents([
                        new MessageButton()
                            .setLabel('領取 Claim')
                            .setCustomId('drop')
                            .setStyle('SUCCESS'),
                    ]),
            ],
        });
        await drop.create({ timestamp: Message.createdTimestamp, claimed: [], mid: Message.id });
        if (res && res.id) {
            try {
                const DM = await Channel.messages.fetch(res.mid);
                await DM.delete();
            } catch {}
        }
        setTimeout(dropF, getRandomNum(300000, 1200000));
    };

    setTimeout(dropF, getRandomNum(300000, 1200000));
};
