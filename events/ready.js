/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const {
    MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton,
} = require('discord.js');
const { readdirSync } = require('fs');
const logger = require('../modules/Logger.js');
const { settings } = require('../config.js');
const level = require('../models/level.js');
const ticket = require('../models/ticket');
const vote = require('../models/vote');
const drop = require('../models/drop');
const { getRandomNum } = require('../modules/functions.js');

module.exports = async (client) => {
    logger.log(`${client.user.tag}, 成員數: ${client.guilds.cache.map((g) => g.memberCount).reduce((a, b) => a + b, 0)} ，伺服器數: ${client.guilds.cache.size}`, 'ready');
    const activity = () => {
        client.user.setActivity(`${settings.prefix}help | Made By Tails`, { type: 'PLAYING' });
    };
    activity();
    setInterval(activity, 60000);

    const catList = new Map([
        ['economy', '經濟'],
        ['information', '資訊'],
        ['message', '訊息'],
        ['moderator', '管理'],
        ['music', '音樂'],
        ['system', '系統'],
        ['tool', '工具'],
        ['misc', '雜項'],
        ['mission', '任務'],
        ['phase1', '階段1'],
    ]);

    const helpEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('指令列表')
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
        helpEmbed.addFields([
            { name: `${catList.get(folder)}`, value: res, inline: false },
        ]);
    });

    client.preload = {
        helpEmbed,
    };

    const targetGuild = client.guilds.cache.get('828450904990154802');

    setInterval(() => {
        const count = targetGuild.memberCount;
        client.channels.cache.get('897054056625885214').setName(`📈｜成員數:${count}`);
        client.channels.cache.get('898168354680995880').send(`成員數:${count}`);
    }, 300000);

    setInterval(async () => {
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);
        const activeLevelData = await level.find({ discordid: { $in: targetGuild.roles.cache.get('856808847251734559').members.map((m) => m.id) } });
        activeLevelData.forEach(async (data) => {
            const count = data.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0);
            if (count < 60) {
                const m = targetGuild.members.cache.get(data.discordid);
                if (m) {
                    m.roles.remove('856808847251734559');
                }
            }
            if (count < 150) {
                const m = targetGuild.members.cache.get(data.discordid);
                if (m) {
                    m.roles.remove('1014857925107392522');
                }
            }
        });
        const sActiveLevelData = await level.find({ discordid: { $in: targetGuild.roles.cache.get('861459068789850172').members.map((m) => m.id) } });
        sActiveLevelData.forEach(async (data) => {
            if (data.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0) < 150) {
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
                Channel.send(`恭喜 ${highest.map((k) => `<@${k}>`).join(' ')} 當選`);
            });
        } catch { }
    }, 2000);

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
                    const candidate = client.users.cache.get(d) || {
                        tag: '未知',
                        id: d,
                        username: '未知',
                    };
                    const arr = res.data.filter((k) => k.candidate === d);
                    str += `${emojis[i]} <@${candidate.id}> (${arr.length}票)\n`;
                    if (arr.length === max) {
                        highest.push(d);
                    } else if (arr.length > max) {
                        highest = [d];
                        max = arr.length;
                    }
                    selectList.push({
                        label: candidate.discriminator === '0' ? candidate.username : candidate.tag,
                        value: d,
                        emoji: emojis[i],
                    });
                    i += 1;
                });
                Embed.setDescription(`最高票: ${highest.map((k) => `<@${k}>`).join(' ')}\n結束時間: <t:${Math.round(res.time / 1000)}> <t:${Math.round(res.time / 1000)}:R>\n\n${str}`);
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('voteSelect')
                            .setPlaceholder('投票區 Election Area')
                            .addOptions(selectList),
                    );
                await Message.edit({ embeds: [Embed], components: [row] });
            });
        } catch { }
    }, 60000);

    // setInterval(async () => {
    //     try {
    //         const now = Date.now();
    //         let res = await giveaway.find();
    //         res = res.filter((d) => d.users.length === 0).filter((d) => now > d.time);
    //         const data = res[0];
    //         const Channel = client.channels.cache.get(data.channelid);
    //         const msg = await Channel.messages.fetch(data.messageid);
    //         if (!msg || !Channel) {
    //             await giveaway.deleteOne({ messageid: data.messageid });
    //             return;
    //         }
    //         const reactUsers = msg.reactions.cache.get('931773626057912420').users.cache.map((u) => u.id).filter((i) => i !== '889358372170792970');
    //         if (reactUsers.length === 0) {
    //             Channel.send('沒有人參加抽獎 🐸');
    //             await giveaway.deleteOne({ messageid: data.messageid });
    //             return;
    //         }
    //         await giveaway.updateOne({ messageid: data.messageid }, { users: reactUsers });
    //         let winners = [];
    //         if (reactUsers.length <= data.winner) {
    //             winners = reactUsers;
    //         }
    //         while (winners.length < data.winner) {
    //             // eslint-disable-next-line no-await-in-loop
    //             const winUser = await client.users.fetch(reactUsers[Math.floor((Math.random() * reactUsers.length))]);
    //             if (!winners.includes(winUser)) {
    //                 winners.push(winUser);
    //             }
    //         }
    //         Channel.send(`恭喜 ${winners.join(' ')} 中獎 😭👏`);
    //     } catch {}
    // }, 1000);

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

        const activeRole = Guild.roles.cache.get('856808847251734559');
        const activeEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`活躍成員清單 (近三天100則訊息) (${activeRole.members.size}個)`)
            .setDescription(activeRole.members.map((d) => d).join('\n'));

        const sActiveRole = Guild.roles.cache.get('861459068789850172');
        const sActiveEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`超級活躍成員清單 (近兩天250則訊息) (${sActiveRole.members.size}個)`)
            .setDescription(sActiveRole.members.map((d) => d).join('\n'))
            .setFooter({ text: `最後編輯時間 ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}` });

        const nActiveRole = Guild.roles.cache.get('1014857925107392522');
        const nActiveEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`中等活躍成員清單 (近三天200則訊息) (${nActiveRole.members.size}個)`)
            .setDescription(nActiveRole.members.map((d) => d).join('\n'))
            .setFooter({ text: `最後編輯時間 ${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}` });

        await Message.edit({
            content: null,
            embeds: [serverInfoEmbed, activeEmbed, nActiveEmbed, sActiveEmbed],
            files: [],
        });
    }, 60000);

    const dropF = async () => {
        setTimeout(dropF, getRandomNum(300000, 1200000));
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
            } catch { }
        }
    };

    setTimeout(dropF, getRandomNum(300000, 1200000));
};
