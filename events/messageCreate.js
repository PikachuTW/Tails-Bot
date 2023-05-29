const logger = require('../modules/Logger.js');
const { permlevel } = require('../modules/functions.js');
const { settings: { prefix }, permLevels } = require('../config.js');
const levelModel = require('../models/level.js');
const afkModel = require('../models/afk.js');

module.exports = async (client, message) => {
    if (message.guildId !== '828450904990154802') return;
    const { container } = client;
    let cmdname2;
    if (!message.author.bot && message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const permlevelGet = permlevel(message.member);
        const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));
        if (cmd) {
            const permNeededNum = container.levelCache[cmd.conf.permLevel] === undefined ? Infinity : container.levelCache[cmd.conf.permLevel];
            if (permlevelGet < permNeededNum) {
                message.reply(`你沒有權限使用!\n你的權限等級為 ${permlevelGet} (${permLevels.find((l) => l.level === permlevelGet).name})\n你需要權限等級 ${permNeededNum} (${cmd.conf.permLevel})`).catch();
            } else {
                try {
                    const stamp = client.container.cooldown.get(message.author.id) || 0;
                    const now = Date.now();
                    if (now - stamp < 1500 && message.author.id !== '650604337000742934') {
                        try {
                            message.reply(`指令還在冷卻中! (${((1500 - (now - stamp)) / 1000).toPrecision(2)}秒)`);
                        } catch { }
                    } else {
                        await cmd.run(client, message, args);
                        client.container.cooldown.set(message.author.id, now);
                        logger.log(`${permLevels.find((l) => l.level === permlevelGet).name} ${message.author.tag} 執行了 ${cmd.conf.name}`, 'cmd');
                        cmdname2 = cmd.conf.name;
                    }
                } catch (e) {
                    message.channel.send({ content: `出現了些錯誤\n\`\`\`${e.message}\`\`\``.slice(0, 2000) });
                }
            }
        }
    }
    if (message.author.bot) return;
    if (!['650604337000742934', '962270937665896478', '889358372170792970'].includes(message.member.id) && message.mentions.users.size >= 5) {
        message.member.timeout(30000, 'mass ping');
        message.channel.send(`:x: ${message.author} 你不允許大量提及用戶!!`);
    }
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        message.reply(`嗨! 機器人的前綴是 \`${prefix}\``);
    }
    if (['948178858610405426', '1075964798958846002'].includes(message.channel.id) && !message.content.toLowerCase().startsWith('s?')) {
        const levelData = await levelModel.findOneAndUpdate(
            { discordid: message.author.id },
            { $setOnInsert: { daily: [] } },
            { upsert: true, new: true },
        );
        const stamp = client.container.msgCooldown.get(message.author.id);
        const nowMS = Date.now();
        if (!(stamp && nowMS - stamp < 750)) {
            client.container.msgCooldown.set(message.author.id, nowMS);
            const nowStamp = Math.floor((nowMS + 28800000) / 86400000);
            const check = await levelData.daily.find((d) => d.date === nowStamp);
            if (!check) {
                await levelModel.updateOne({ discordid: message.author.id }, { $push: { daily: { date: nowStamp, count: 1 } } });
            } else {
                await levelModel.updateOne({ discordid: message.author.id, 'daily.date': nowStamp }, { $inc: { 'daily.$.count': 1 } });
            }
            const active = levelData.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0);
            const sActive = levelData.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0);

            const roles = [
                { count: 59, roleId: '856808847251734559' },
                { count: 149, roleId: '1014857925107392522' },
                { count: 149, roleId: '861459068789850172' },
            ];
            roles.forEach(({ count, roleId }) => {
                if ((roleId === '861459068789850172' ? sActive >= count : active >= count) && !message.member.roles.cache.has(roleId)) {
                    message.member.roles.add(roleId);
                    const role = message.guild.roles.cache.get(roleId);
                    message.channel.send(`${message.member} 已經獲得 <@${role.id}>`, { allowedMentions: { parse: ['users'] } });
                }
            });
        }
    }

    const afkData = await afkModel.find();
    if (afkData.length > 0) {
        const afkList = afkData.map((d) => d.discordid);
        let checkFor = false;
        afkList.forEach((d) => {
            if (message.mentions.members.map((m) => m.id).includes(d) && checkFor === false) {
                const { content } = afkData.find((a) => a.discordid === d);
                message.channel.send({ content: `<@${d}> 正在afk: ${content}`, allowedMentions: { parse: [] } });
                checkFor = true;
            }
        });
        if (afkList.includes(message.author.id) && cmdname2 !== 'afk') {
            await afkModel.deleteOne({ discordid: message.author.id });
            message.reply('已經解除你的afk!');
        }
    }
};
