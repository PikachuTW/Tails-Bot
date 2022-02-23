const logger = require('./Logger.js');
const config = require('../config.js');
const { whitelist } = require('../config.js');

function permlevel(message) {
    let permlvl = 0;

    const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

    while (permOrder.length) {
        const currentLevel = permOrder.shift();
        if (currentLevel.check(message)) {
            permlvl = currentLevel.level;
            break;
        }
    }
    return permlvl;
}

function leaderCheck(target) {
    if (whitelist.leader.indexOf(target.id) != -1) {
        return true;
    }
    else {
        return false;
    }
}

function targetGet(message, arg) {
    return message.mentions.members.first() || message.guild.members.cache.find(member => member.id === arg);
}

async function awaitReply(message, question, limit = 60000) {
    const filter = m => m.author.id === message.author.id;
    await msg.channel.send(question);
    try {
        const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ['time'] });
        return collected.first().content;
    }
    catch (e) {
        return false;
    }
}


/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */

// EXTENDING NATIVE TYPES IS BAD PRACTICE. Why? Because if JavaScript adds this
// later, this conflicts with native code. Also, if some other lib you use does
// this, a conflict also occurs. KNOWING THIS however, the following 2 methods
// are, we feel, very useful in code.

// <String>.toProperCase() returns a proper-cased string such as:
// "Mary had a little lamb".toProperCase() returns "Mary Had A Little Lamb"
Object.defineProperty(String.prototype, 'toProperCase', {
    value: function() {
        return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
});

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    logger.error(`Uncaught Exception: ${errorMsg}`);
    console.error(err);
    // Always best practice to let the code crash on uncaught exceptions.
    // Because you should be catching them anyway.
    process.exit(1);
});

process.on('unhandledRejection', err => {
    logger.error(`Unhandled rejection: ${err}`);
    console.error(err);
});


module.exports = { permlevel, leaderCheck, targetGet };