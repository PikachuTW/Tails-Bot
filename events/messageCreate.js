/* eslint-disable no-param-reassign */
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
                        if (message.author.discriminator === '0') {
                            const newName = message.author.username;
                            message.author.newName = newName;
                            message.member.user.newName = newName;
                        } else {
                            message.author.newName = message.author.tag;
                            message.member.user.newName = message.author.tag;
                        }
                        await cmd.run(client, message, args);
                        client.container.cooldown.set(message.author.id, now);
                        logger.log(`${permLevels.find((l) => l.level === permlevelGet).name} ${message.author.newName} 執行了 ${cmd.conf.name}`, 'cmd');
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
    if (['948178858610405426', '1144935378437017662'].includes(message.channel.id) && !message.content.toLowerCase().startsWith('s?')) {
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
            const total = levelData.daily.map((d) => d.count).reduce((a, b) => a + b, 0);
            const active = levelData.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0);
            const sActive = levelData.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0);

            const activeRoles = [
                { count: 59, roleId: '856808847251734559' },
                { count: 149, roleId: '1014857925107392522' },
                { count: 149, roleId: '861459068789850172' },
            ];
            activeRoles.forEach(({ count, roleId }) => {
                if ((roleId === '861459068789850172' ? sActive >= count : active >= count) && !message.member.roles.cache.has(roleId)) {
                    message.member.roles.add(roleId);
                    if (message.member.roles.has(roleId)) {
                        message.channel.send({ content: `${message.member} 已經獲得 <@&${roleId}>`, allowedMentions: { parse: ['users'] } });
                    }
                }
            });
            const totalMsgRoles = [
                { count: 4, roleId: '1201814055426473984' },
                { count: 39, roleId: '1201815869974650901' },
                { count: 99, roleId: '1201815771190399016' },
                { count: 249, roleId: '1201815676033966130' },
                { count: 499, roleId: '1201815604944707594' },
                { count: 999, roleId: '1201815541602603018' },
                { count: 1999, roleId: '1201815472505630720' },
                { count: 4999, roleId: '1201815306159534120' },
                { count: 9999, roleId: '1201815249628704768' },
                { count: 19999, roleId: '1201815168573505567' },
                { count: 29999, roleId: '1201815103423643698' },
                { count: 39999, roleId: '1201814971818979348' },
                { count: 49999, roleId: '1201814860757999638' },
                { count: 59999, roleId: '1201814747436032041' },
                { count: 74999, roleId: '1201814654041456670' },
                { count: 99999, roleId: '1201814547405750342' },
                { count: 124999, roleId: '1201814374168408114' },
                { count: 149999, roleId: '1201814291465117747' },
            ];
            let highestRoleExist = false;
            let highestRole;
            let highestIndex;
            totalMsgRoles.forEach((element, index) => {
                if (total >= element.count) {
                    highestRoleExist = true;
                    highestRole = element;
                    highestIndex = index;
                }
            });
            if (highestRoleExist) { message.member.roles.remove(totalMsgRoles.filter((r) => r.roleId !== highestRole.roleId).map((r) => r.roleId)); }
            if (highestRoleExist && !message.member.roles.cache.has(highestRole.roleId)) {
                message.member.roles.add(highestRole.roleId);
                if (message.member.roles.has(highestRole.roleId)) {
                    if (highestIndex >= totalMsgRoles.length - 1) {
                        message.channel.send({ content: `${message.member} 已經獲得 <@&${highestRole.roleId}>`, allowedMentions: { parse: ['users'] } });
                    } else {
                        message.channel.send({ content: `${message.member} 已經獲得 <@&${highestRole.roleId}>，下一個身份組在${totalMsgRoles[highestIndex + 1].count + 1}訊息量，可以用t!rank查詢你的總訊息量，努力聊天來升級吧!`, allowedMentions: { parse: ['users'] } });
                    }
                }
            }
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
