if (Number(process.version.slice(1).split('.')[0]) < 17) throw new Error('Node.js 的等級必須要大於等於 17 ，請進行更新');

const dotenv = require('dotenv');
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const mongoose = require('mongoose');
const { REST } = require('@discordjs/rest');

const { permLevels } = require('./config.js');
const logger = require('./modules/Logger.js');
const functions = require('./modules/functions.js');

dotenv.config();
const client = new Client({ intents: 131071, partials: ['CHANNEL', 'USER', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'GUILD_SCHEDULED_EVENT'] });
client.login(process.env.DISCORD_TOKEN);
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
mongoose
    .connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('已經連線到資料庫');
    })
    .catch((err) => console.log(err));

const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
    const thisLevel = permLevels[i];
    levelCache[thisLevel.name] = thisLevel.level;
}

client.container = {
    commands: new Collection(),
    aliases: new Collection(),
    levelCache,
    rest,
    interactions: {
        button: new Collection(),
        context: new Collection(),
        select: new Collection(),
        slash: new Collection(),
    },
    cooldown: new Collection(),
    msgCooldown: new Collection(),
    interactionCooldown: new Collection(),
    robCooldown: new Collection(),
    wordcd: new Collection(),
};
client.fn = functions;
client.word = {};
for (let i = 1; i <= 6; i++) {
    const data = require(`./7000words/${i}級.json`);
    client.word[`${i}`] = data;
}

const data = require('./7000words/11級.json');

client.word['11'] = data;

const folders = readdirSync('./commands/').filter((file) => !file.endsWith('.js'));
folders.forEach((folder) => {
    const cmds = readdirSync(`./commands/${folder}/`).filter((file) => file.endsWith('.js'));
    cmds.forEach((file) => {
        try {
            const code = require(`./commands/${folder}/${file}`);
            const cmdName = file.split('.')[0];
            code.conf.name = cmdName;
            client.container.commands.set(cmdName, code);
            code.conf.aliases.forEach((alias) => {
                client.container.aliases.set(alias, cmdName);
            });
            logger.log(`CMD ${cmdName} 已被載入 ✅`, 'log');
        } catch (error) {
            logger.log(`${error}`, 'error');
        }
    });
});

const eventFiles = readdirSync('./events/').filter((file) => file.endsWith('.js'));
eventFiles.forEach((file) => {
    try {
        const eventName = file.split('.')[0];
        logger.log(`EVENT ${eventName} 已被載入 ✅`, 'log');
        const event = require(`./events/${file}`);
        client.on(eventName, event.bind(null, client));
    } catch (error) {
        logger.log(`${error}`, 'error');
    }
});

const interactionFolder = readdirSync('./interactions/').filter((file) => !file.endsWith('.js'));
interactionFolder.forEach((folder) => {
    const cmds = readdirSync(`./interactions/${folder}/`).filter((file) => file.endsWith('.js'));
    cmds.forEach((file) => {
        try {
            const code = require(`./interactions/${folder}/${file}`);
            const cmdName = file.split('.')[0];
            if (folder === 'button') {
                client.container.interactions.button.set(cmdName, code);
            } else if (folder === 'context') {
                client.container.interactions.context.set(cmdName, code);
            } else if (folder === 'select') {
                client.container.interactions.select.set(cmdName, code);
            } else if (folder === 'slash') {
                client.container.interactions.slash.set(cmdName, code);
            }
            logger.log(`INTERACTION ${cmdName} 已被載入 ✅`, 'log');
        } catch (error) {
            logger.log(`${error}`, 'error');
        }
    });
});

setInterval(() => {
    if (Number.isNaN(client.ws.ping)) {
        process.exit(0);
    }
}, 60000);
