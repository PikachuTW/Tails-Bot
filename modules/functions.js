const Discord = require('discord.js');
const config = require('../config.js');
const credit = require('../models/credit.js');
const boost = require('../models/boost.js');
const misc = require('../models/misc.js');
const marry = require('../models/marry.js');

const permlevel = (target) => {
    let permlvl = 0;

    const permOrder = config.permLevels.slice(0).sort((p, c) => (p.level < c.level ? 1 : -1));

    while (permOrder.length) {
        const currentLevel = permOrder.shift();
        if (currentLevel.check(target)) {
            permlvl = currentLevel.level;
            break;
        }
    }
    return permlvl;
};

const targetGet = (message, args) => {
    if (!args[0]) return undefined;
    if (args[0].matchAll(Discord.MessageMentions.USERS_PATTERN).next().value) {
        return message.guild.members.resolve(args[0].matchAll(Discord.MessageMentions.USERS_PATTERN).next().value[1]);
    }
    return message.guild.members.resolve(args[0]);
};

const timeConvert = (num) => {
    const totalSec = Math.round(num / 1000);
    const sec = totalSec % 60;
    const min = Math.floor((totalSec / 60)) % 60;
    const hour = Math.floor((totalSec / 3600)) % 24;
    const day = Math.floor(totalSec / 86400);
    let res;
    if (day > 0) {
        res = `${day}日${hour}時${min}分${sec}秒`;
    } else if (hour > 0) {
        res = `${hour}時${min}分${sec}秒`;
    } else if (min > 0) {
        res = `${min}分${sec}秒`;
    } else {
        res = `${sec}秒`;
    }
    return res;
};

const nowTime = () => new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

const delay = (ms = 1000) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

/**
   *
   * @param {*} min
   * @param {*} max
   * @returns min ~ max random number
   */
const getRandomNum = (min, max) => {
    try {
        return Math.random() * (max - min) + min;
    } catch (e) {
        console.log(String(e.stack).bgRed);
    }
};

const getCredit = async (member) => {
    let data = await credit.findOne({ discordid: member.id });
    if (!data) {
        data = await credit.create({
            discordid: member.id,
            tails_credit: 0,
        });
        await credit.findOne({ discordid: member.id });
    }
    return data.tails_credit;
};

const getMulti = async (client, member) => {
    const bt = await boost.findOne({ user: member.id, timestamp: { $gte: Date.now() } });
    let multi = 1;
    if (member.roles.cache.has('830689873367138304')) {
        multi += 0.075; // 活躍
    }
    if (member.roles.cache.has('1014857925107392522')) {
        multi += 0.1; // 中等活躍
    }
    if (member.roles.cache.has('861459068789850172')) {
        multi += 0.125; // 超級活躍
    }
    if (member.roles.cache.has('830689873367138304')) {
        multi += 0.1; // 加成者
    }
    if (bt && bt.type === 'MONEY') {
        multi += 0.25;
    }

    const marryres = await marry.findOne({ users: member.id });
    if (marryres) {
        const man = member.guild.members.cache.get(marryres.users[0]);
        const woman = member.guild.members.cache.get(marryres.users[1]);
        if (man.roles.cache.has('861459068789850172') && woman.roles.cache.has('861459068789850172')) {
            multi += 0.8;
        } else if (man.roles.cache.has('1014857925107392522') && woman.roles.cache.has('1014857925107392522')) {
            multi += 0.5;
        } else if (man.roles.cache.has('856808847251734559') && woman.roles.cache.has('856808847251734559')) {
            multi += 0.3;
        }
    }
    const { value_num } = await misc.findOne({ key: 'ac' });
    multi += (value_num ** 1.11 / 200);
    return multi;
};

// async function awaitReply(message, question, limit = 60000) {
//     const filter = m => m.author.id === message.author.id;
//     await msg.channel.send(question);
//     try {
//         const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ['time'] });
//         return collected.first().content;
//     }
//     catch (e) {
//         return false;
//     }
// }

/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */

// EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
// later, this conflicts with native code. Also, if some other lib you use does
// this, a conflict also occurs. KNOWING THIS however, the following 2 methods
// are, we feel, very useful in code.

// <String>.toProperCase() returns a proper-cased string such as:
// "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
// Object.defineProperty(String.prototype, 'toProperCase', {
//     value: function () {
//         return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
//     },
// });

// // These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
// process.on('uncaughtException', (err) => {
//     const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
//     logger.error(`Uncaught Exception: ${errorMsg}`);
//     console.error(err);
//     // Always best practice to let the code crash on uncaught exceptions.
//     // Because you should be catching them anyway.
//     process.exit(1);
// });

// process.on('unhandledRejection', err => {
//     logger.error(`Unhandled rejection: ${err}`);
//     console.error(err);
// });

module.exports = {
    permlevel, targetGet, timeConvert, nowTime, delay, getRandomNum, getCredit, getMulti,
};
