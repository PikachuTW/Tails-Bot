const Discord = require('discord.js');
const config = require('../config.js');
const creditModel = require('../models/credit.js');
const boostModel = require('../models/boost.js');
const miscModel = require('../models/misc.js');
const phase1 = require('../models/phase1.js');

const permlevel = (target) => {
    const permOrder = config.permLevels.slice(0).sort((p, c) => c.level - p.level);
    const currentLevel = permOrder.find((level) => level.check(target));
    return currentLevel ? currentLevel.level : 0;
};

const targetGet = (message, args) => {
    if (!args[0]) return undefined;
    const userMention = args[0].matchAll(Discord.MessageMentions.USERS_PATTERN).next().value;
    let Member;
    if (userMention) {
        Member = message.guild.members.resolve(userMention[1]);
    } else {
        Member = message.guild.members.resolve(args[0]);
    }
    if (Member.user.discriminator === '0') {
        const newName = Member.user.username;
        Member.user.newName = newName;
    } else {
        Member.user.newName = Member.user.tag;
    }
    return Member;
};

const timeFormat = (milliseconds, complex = false) => {
    const totalSec = Math.round(milliseconds / 1000);
    const seconds = totalSec % 60;
    const minutes = Math.floor((totalSec / 60)) % 60;
    const hours = Math.floor((totalSec / 3600)) % 24;
    const days = Math.floor(totalSec / 86400);

    if (complex) {
        const times = [];
        if (days > 0) times.push(`${days}日`);
        if (hours > 0) times.push(`${hours}時`);
        if (minutes > 0) times.push(`${minutes}分`);
        if (seconds > 0 || times.length === 0) times.push(`${seconds}秒`);
        return times.join('');
    }

    if (days > 0) {
        if (hours === 0) return `${days}天`;
        return `${days}天${hours % 24}小時`;
    }
    if (hours > 0) {
        if (minutes % 60 === 0) return `${hours}小時`;
        return `${hours}小時${minutes % 60}分鐘`;
    }
    if (minutes > 0) return `${minutes}分鐘`;
    return `${seconds}秒`;
};

const nowTime = () => `${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`;

const delay = (ms = 1000) => new Promise(() => setTimeout(ms));

const getRandomNum = (min, max) => Math.random() * (max - min) + min;

const getCredit = async (member) => {
    const data = await creditModel.findOneAndUpdate(
        { discordid: member.id },
        { $setOnInsert: { tails_credit: 0 } },
        { upsert: true, new: true },
    );
    return data.tails_credit;
};

const getMulti = async (member) => {
    const bt = await boostModel.findOne({ user: member.id, timestamp: { $gte: Date.now() } });
    const { value_num } = await miscModel.findOne({ key: 'ac' });
    const phase1Data = await phase1.findOne({ discordid: member.id });
    let multi = 1;
    const roleMultipliers = {
        '856808847251734559': 0.2, // 活躍
        '1014857925107392522': 0.45, // 中等活躍
        '861459068789850172': 0.7, // 超級活躍
        '830689873367138304': 0.3, // 加成者
    };
    member.roles.cache.each((role) => {
        if (role.id in roleMultipliers) {
            multi += roleMultipliers[role.id];
        }
    });
    if (bt && bt.type === 'MONEY') multi += 0.5;
    multi += (value_num ** 1.1 / 250);
    let tails_credit_acc_v1 = 0;
    if (phase1Data && phase1Data.tails_credit_acc_v1) {
        tails_credit_acc_v1 = phase1Data.tails_credit_acc_v1;
    }
    if (tails_credit_acc_v1 > 10) tails_credit_acc_v1 = 10;
    multi *= (1 + tails_credit_acc_v1 * 0.05);
    return multi;
};

module.exports = {
    permlevel, targetGet, timeFormat, nowTime, delay, getRandomNum, getCredit, getMulti,
};
