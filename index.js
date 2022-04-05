if (Number(process.version.slice(1).split('.')[0]) < 17) throw new Error('Node.js 的等級必須要大於等於 17 ，請進行更新');

const dotenv = require('dotenv');
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const play = require('play-dl');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const {
    createAudioPlayer, NoSubscriberBehavior, createAudioResource, getVoiceConnection,
} = require('@discordjs/voice');
const { permLevels } = require('./config.js');
const logger = require('./modules/Logger.js');
const music = require('./models/music.js');
const misc = require('./models/misc.js');
const functions = require('./modules/functions.js');

const urlencodedParser = bodyParser.urlencoded({ extended: false });
dotenv.config();
const client = new Client({ intents: 32767, partials: ['CHANNEL', 'USER', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'] });
client.login(process.env.DISCORD_TOKEN);
mongoose
    .connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('已經連線到資料庫');
    })
    .catch((err) => console.log(err));

const commands = new Collection();
const aliases = new Collection();
const button = new Collection();
const context = new Collection();
const select = new Collection();
const cooldown = new Collection();
const msgCooldown = new Collection();
const interactionCooldown = new Collection();
const robCooldown = new Collection();
const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
});
const levelCache = {};
for (let i = 0; i < permLevels.length; i++) {
    const thisLevel = permLevels[i];
    levelCache[thisLevel.name] = thisLevel.level;
}

client.container = {
    commands,
    aliases,
    levelCache,
    interactions: {
        button,
        context,
        select,
    },
    cooldown,
    msgCooldown,
    interactionCooldown,
    robCooldown,
    player,
};
client.fn = functions;

(async () => {
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
                }
                logger.log(`INTERACTION ${cmdName} 已被載入 ✅`, 'log');
            } catch (error) {
                logger.log(`${error}`, 'error');
            }
        });
    });

    player.on('stateChange', async (oldState, newState) => {
        const connection = getVoiceConnection('828450904990154802');
        if (newState.status === 'idle' && connection.state.status === 'ready') {
            const data = await music.findOne({});
            if (!data.queue[0]) return;
            await music.updateOne({}, { $pop: { queue: -1 } });
            const stream = await play.stream(data.queue[0].url);
            connection.subscribe(player);
            player.play(createAudioResource(stream.stream, {
                inputType: stream.type,
            }));
            client.channels.cache.get('948178858610405426').send(`現正播放 \`${data.queue[0].title}\``);
            await misc.updateOne({ key: 'nowplay' }, {
                $set: {
                    value_object: data.queue[0],
                },
            });
        }
    });

    const app = express();

    app.get('/', (req, res) => {
        res.sendFile('./html/index.html', { root: __dirname });
    });

    app.get('/console', (req, res) => {
        res.sendFile('./html/console.html', { root: __dirname });
    });

    app.post('/console', urlencodedParser, (req, res) => {
        console.log(req.body);
        res.sendFile('./html/console.html', { root: __dirname });
    });

    app.get('*', (req, res) => {
        res.send('404 not found');
    });

    app.listen(3000, () => {
        console.log('Listening!');
    });
})();
