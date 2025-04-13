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
    let member;

    if (userMention) {
        member = message.guild.members.resolve(userMention[1]);
    } else {
        member = message.guild.members.resolve(args[0]);
    }

    if (!member) return undefined;

    if (member.user.discriminator === '0') {
        member.user.newName = member.user.username;
    } else {
        member.user.newName = member.user.tag;
    }

    return member;
};

const timeFormat = (milliseconds, complex = false) => {
    const totalSec = Math.round(milliseconds / 1000);
    const seconds = totalSec % 60;
    const minutes = Math.floor(totalSec / 60) % 60;
    const hours = Math.floor(totalSec / 3600) % 24;
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
        return hours === 0 ? `${days}天` : `${days}天${hours}小時`;
    }
    if (hours > 0) {
        return minutes === 0 ? `${hours}小時` : `${hours}小時${minutes}分鐘`;
    }
    if (minutes > 0) return `${minutes}分鐘`;
    return `${seconds}秒`;
};

const nowTime = () => new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

const delay = (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomNum = (min, max) => Math.random() * (max - min) + min;

const getCredit = async (member) => {
    try {
        const data = await creditModel.findOneAndUpdate(
            { discordid: member.id },
            { $setOnInsert: { tails_credit: 0 } },
            { upsert: true, new: true },
        );
        return data.tails_credit;
    } catch (error) {
        console.error(`Get credit error\n${error}`);
        return 0;
    }
};

const ROLE_MULTIPLIERS = {
    '856808847251734559': 0.2, // 活躍
    '1014857925107392522': 0.45, // 中等活躍
    '861459068789850172': 0.7, // 超級活躍
    '830689873367138304': 0.3, // 加成者
};

const MAX_CREDIT_ACC_V1 = 10;

const getMulti = async (member) => {
    try {
        const [bt, miscData, phase1Data] = await Promise.all([
            boostModel.findOne({ user: member.id, timestamp: { $gte: Date.now() } }),
            miscModel.findOne({ key: 'ac' }),
            phase1.findOne({ discordid: member.id }),
        ]);

        let multi = 1;

        member.roles.cache.forEach((role) => {
            if (ROLE_MULTIPLIERS[role.id]) {
                multi += ROLE_MULTIPLIERS[role.id];
            }
        });

        if (bt?.type === 'MONEY') multi += 0.5;

        const valueNum = miscData?.value_num || 0;
        multi += (valueNum ** 1.1 / 250);

        let tailsCreditAccV1 = phase1Data?.tails_credit_acc_v1 || 0;
        tailsCreditAccV1 = Math.min(tailsCreditAccV1, MAX_CREDIT_ACC_V1);

        multi *= (1 + tailsCreditAccV1 * 0.05);
        return multi;
    } catch (error) {
        console.error(`Get multiplier error\n${error}`);
        return 0;
    }
};

module.exports = {
    permlevel,
    targetGet,
    timeFormat,
    nowTime,
    delay,
    getRandomNum,
    getCredit,
    getMulti,
};
