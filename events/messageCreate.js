const logger = require('../modules/Logger.js');
const { permlevel } = require('../modules/functions.js');
const config = require('../config.js');
const { settings: { prefix } } = require('../config.js');
const level = require('../models/level.js');
const afk = require('../models/afk.js');

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
                message.reply(`你沒有權限使用!\n你的權限等級為 ${permlevelGet} (${config.permLevels.find((l) => l.level === permlevelGet).name})\n你需要權限等級 ${permNeededNum} (${cmd.conf.permLevel})`).catch();
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
                        logger.log(`${config.permLevels.find((l) => l.level === permlevelGet).name} ${message.author.tag} 執行了 ${cmd.conf.name}`, 'cmd');
                        cmdname2 = cmd.conf.name;
                    }
                } catch (e) {
                    message.channel.send({ content: `出現了些錯誤\n\`\`\`${e.message}\`\`\`` });
                }
            }
        }
    }
    const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite', 't.me', 'lamtintinfree'];
    if (bannedWords.some((word) => unescape(message.content.toLowerCase()).includes(word) || message.content.toLowerCase().includes(word) || message.author.username.toLowerCase().includes(word)) && ['650604337000742934', '889358372170792970', '785496543141560371'].indexOf(message.author.id) === -1 && message.channel.id !== '869948348285722654') {
        try {
            await message.delete();
            message.channel.send(`:x: ${message.author} 你不允許發送邀請連結!!`);
        } catch { }
    }
    if (message.author.bot) return;
    if (['650604337000742934', '962270937665896478', '889358372170792970'].indexOf(message.member.id) === -1 && message.mentions.users.size >= 5) {
        message.member.timeout(30000, 'mass ping');
        message.channel.send(`:x: ${message.author} 你不允許大量提及用戶!!`);
    }
    if (message.member.roles.cache.has('881911118845587477')) {
        if (message.mentions.everyone === true || message.mentions.roles.size > 0) {
            const lockchannel = message.guild.channels.cache.get('948178858610405426');
            if (lockchannel.permissionsFor('881911118845587477').any('MENTION_EVERYONE')) {
                lockchannel.permissionOverwrites.edit('881911118845587477', { MENTION_EVERYONE: false });
            }
        }
    }
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        message.reply(`嗨! 機器人的前綴是 \`${prefix}\``);
    }

    if (message.channel.id === '948178858610405426') {
        let levelData = await level.findOne({ discordid: message.author.id });
        if (!levelData) {
            levelData = await level.create({
                discordid: message.author.id,
                daily: [],
            });
        }
        const stamp = client.container.msgCooldown.get(message.author.id);
        const nowMS = Date.now();
        if (!(stamp && nowMS - stamp < 750)) {
            client.container.msgCooldown.set(message.author.id, nowMS);
            const nowStamp = Math.floor((nowMS + 28800000) / 86400000);
            const check = await levelData.daily.find((d) => d.date === nowStamp);
            if (!check) {
                await level.updateOne({ discordid: message.author.id }, { $push: { daily: { date: nowStamp, count: 1 } } });
            } else {
                await level.updateOne({ discordid: message.author.id, 'daily.date': nowStamp }, { $inc: { 'daily.$.count': 1 } });
            }
            const active = levelData.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0);
            const sActive = levelData.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0);
            if (active >= 99) {
                if (!message.member.roles.cache.has('856808847251734559')) {
                    message.member.roles.add('856808847251734559');
                    message.channel.send({ content: `${message.member} 已經獲得 <@&856808847251734559>`, allowedMentions: { parse: ['users'] } });
                }
            }
            if (active >= 199) {
                if (!message.member.roles.cache.has('1014857925107392522')) {
                    message.member.roles.add('1014857925107392522');
                    message.channel.send({ content: `${message.member} 已經獲得 <@&1014857925107392522>`, allowedMentions: { parse: ['users'] } });
                }
            }
            if (sActive >= 249) {
                if (!message.member.roles.cache.has('861459068789850172')) {
                    message.member.roles.add('861459068789850172');
                    message.channel.send({ content: `${message.member} 已經獲得 <@&861459068789850172>`, allowedMentions: { parse: ['users'] } });
                }
            }
        }
    }

    const afkData = await afk.find();
    if (afkData.length > 0) {
        const afkList = afkData.map((d) => d.discordid);
        let checkFor = false;
        afkList.forEach((d) => {
            if (message.mentions.members.map((m) => m.id).indexOf(d) !== -1 && checkFor === false) {
                const { content } = afkData.find((a) => a.discordid === d);
                message.channel.send({ content: `<@${d}> 正在afk: ${content}`, allowedMentions: { parse: [] } });
                checkFor = true;
            }
        });
        if (afkList.indexOf(message.author.id) !== -1 && cmdname2 !== 'afk') {
            await afk.deleteOne({ discordid: message.author.id });
            message.reply('已經解除你的afk!');
        }
    }
};
