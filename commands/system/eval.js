const { codeBlock } = require('@discordjs/builders');
const os = require('os');

/*
  MESSAGE CLEAN FUNCTION

  "Clean" removes @everyone pings, as well as tokens, and makes code blocks
  escaped so they're shown more easily. As a bonus it resolves promises
  and stringifies objects!
  This is mostly only used by the Eval and Exec commands.
*/
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
    }
    catch (err) {
        message.channel.send(codeBlock('js', err));
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'eval',
    category: '系統',
    description: '執行任何 javascript 程式碼',
    usage: 'eval [...code]',
};
