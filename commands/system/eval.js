const { codeBlock } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const got = require('got');
const logger = require('../../modules/Logger.js');

const clean = async (client, text) => {
    let value = text;
    if (value && value.constructor.name === 'Promise') { value = await value; }
    if (typeof value !== 'string') { value = require('util').inspect(value, { depth: 3 }); }

    value = value
        .replace(/`/g, `\`${String.fromCharCode(8203)}`)
        .replace(/@/g, `@${String.fromCharCode(8203)}`);

    value = value.replaceAll(client.token, '[REDACTED]');

    return value;
};

exports.run = async (client, message, args) => {
    const code = args.join(' ');
    try {
        // eslint-disable-next-line no-eval
        const evaled = eval(code);
        const cleaned = await clean(client, evaled);
        if (cleaned.startsWith('<ref *1>')) return;
        message.channel.send(codeBlock('js', cleaned));
        logger.log(`${cleaned}`, 'eval');
    } catch (err) {
        message.channel.send(codeBlock('js', err));
        logger.log(`${err}`, 'error');
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    description: '執行任何 javascript 程式碼',
    usage: 'eval [程式碼]',
};
