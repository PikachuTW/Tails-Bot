const logger = require('../modules/Logger.js');
const { permlevel } = require('../modules/functions.js');
const config = require('../config.js');
const { settings } = require('../config.js');
const cooldown = require('../models/cooldown.js');
const level = require('../models/level.js');
// const misc = require('../models/misc.js');
const prefix = settings.prefix;

module.exports = async (client, message) => {
    if (message.guildId !== '828450904990154802') return;
    const { container } = client;
    const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite'];
    if (bannedWords.some(word => message.content.toLowerCase().includes(word)) && message.author.id != '650604337000742934' && message.author.id != '889358372170792970' && message.channel.id != '869948348285722654') {
        message.delete();
        return message.channel.send(`:x: ${message.author} 你不允許發送邀請連結!!`);
    }
    if (message.author.bot) return;
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        return message.reply(`嗨! 機器人的前綴是 \`${prefix}\``);
    }

    // if (message.channel.id == '857947371631804437') {
    //   const now = await misc.findOne({ 'key': 'countChannel' });
    //   if (message.content != now.value_num) return message.delete();
    //   await misc.updateOne({ 'key': 'countChannel' }, { $inc: { 'value_num': 1 } });
    //   return;
    // }

    if (message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        const permlevelGet = permlevel(message);
        const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));
        if (!cmd) return;
        if (!cmd.conf.enabled) return;
        if (permlevelGet < container.levelCache[cmd.conf.permLevel]) {
            return message.channel.send(`你沒有權限使用!\n你的權限等級為 ${permlevelGet} (${config.permLevels.find(l => l.level === permlevelGet).name})\n你需要權限等級 ${container.levelCache[cmd.conf.permLevel]} (${cmd.conf.permLevel})`);
        }
        message.author.permLevel = permlevelGet;
        try {
            let data = await cooldown.findOne({ discordid: message.author.id });
            if (!data) {
                data = await cooldown.create({
                    discordid: message.author.id,
                    stamp: 0,
                });
            }
            if (Date.now() - data.stamp < 5000 && message.author.id != '650604337000742934') {
                return message.reply(`指令還在冷卻中! (${((5000 - (Date.now() - data.stamp)) / 1000).toPrecision(2)}秒)`);
            }

            await cmd.run(client, message, args);
            await cooldown.updateOne({ 'discordid': message.author.id }, { $set: { 'stamp': Date.now() } });
            client.channels.cache.find(channel => channel.id === '891011360413057075').send(`${config.permLevels.find(l => l.level === permlevelGet).name} ${message.author.id} ${message.author.tag} ran command ${cmd.help.name}`, 'cmd');
            logger.log(`${config.permLevels.find(l => l.level === permlevelGet).name} ${message.author.tag} 執行了 ${cmd.help.name}`, 'cmd');
        }
        catch (e) {
            message.channel.send({ content: `出現了些錯誤\n\`\`\`${e.message}\`\`\`` });
        }
    }

    if (['832219569501241385', '832219589046829086', '859245756737388544'].indexOf(message.channel.id) != -1 || message.author.id == '650604337000742934') {
        let levelData = await level.findOne({ 'discordid': message.author.id });
        if (!levelData) {
            levelData = await level.create({
                discordid: message.author.id,
                timestamp: 0,
                daily: [],
            });
        }

        const nowMS = Date.now();
        if (nowMS - levelData.timetamp < 1000 && message.author.id != '650604337000742934') return;
        await level.updateOne({ 'discordid': message.author.id }, { $set: { 'timestamp': nowMS } });
        const nowStamp = Math.floor((nowMS + 28800000) / 86400000);
        const check = await levelData.daily.find(d => d.date == nowStamp);
        if (!check) {
            await level.updateOne({ 'discordid': message.author.id }, { $push: { 'daily': { 'date': nowStamp, 'count': 1 } } });
        }
        else {
            await level.updateOne({ 'discordid': message.author.id, 'daily.date': nowStamp }, { $inc: { 'daily.$.count': 1 } });
        }

        const active = levelData.daily.filter(d => d.date >= nowStamp - 2).map(d => d.count).reduce((a, b) => a + b, 0);
        const s_active = levelData.daily.filter(d => d.date >= nowStamp - 1).map(d => d.count).reduce((a, b) => a + b, 0);
        if (active > 100) {
            if (!message.member.roles.cache.find(r => r.id == '856808847251734559')) {
                message.member.roles.add('856808847251734559');
            }
        }
        if (s_active > 300) {
            if (!message.member.roles.cache.find(r => r.id == '861459068789850172')) {
                message.member.roles.add('861459068789850172');
            }
        }
    }
};