const { codeBlock } = require('@discordjs/builders');
const logger = require('../../modules/Logger.js');

async function clean(client, text) {
    if (text && text.constructor.name == 'Promise') { text = await text; }
    if (typeof text !== 'string') { text = require('util').inspect(text, { depth: 1 }); }

    text = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203));

    text = text.replaceAll(client.token, '[REDACTED]');

    return text;
}

exports.run = async (client, message, args) => {
    const code = args.join(' ');
    try {
        const evaled = eval(code);
        const cleaned = await clean(client, evaled);
        if (cleaned.startsWith('<ref *1>')) return;
        message.channel.send(codeBlock('js', cleaned));
        logger.log(`${cleaned}`, 'eval');
    }
    catch (err) {
        message.channel.send(codeBlock('js', err));
        logger.log(`${err}`, 'error');
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'eval',
    description: '執行任何 javascript 程式碼',
    usage: 'eval [...code]',
};
