if (Number(process.version.slice(1).split('.')[0]) < 17) throw new Error('Node 的等級必須要大於 17.x ，請進行更新');

require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { permLevels } = require('./config.js');
const logger = require('./modules/Logger.js');
const client = new Client({ intents: 32767, partials: ['CHANNEL', 'USER', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'] });
const mongoose = require('mongoose');
const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const music = require('./models/music.js');
const misc = require('./models/misc.js');
const play = require('play-dl');

const commands = new Collection();
const aliases = new Collection();

const player = createAudioPlayer({
    behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },
});

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
    commands,
    aliases,
    levelCache,
    player,
};

const init = async () => {

    const folders = readdirSync('./commands/').filter(file => !file.endsWith('.js'));
    for (const folder of folders) {
        const cmds = readdirSync(`./commands/${folder}/`).filter(file => file.endsWith('.js'));
        for (const file of cmds) {
            try {
                const code = require(`./commands/${folder}/${file}`);
                logger.log(`CMD ${code.help.name} 已被載入 ✔`, 'log');
                client.container.commands.set(code.help.name, code);
                code.conf.aliases.forEach(alias => {
                    client.container.aliases.set(alias, code.help.name);
                });
            }
            catch (error) {
                logger.log(`${error}`, 'error');
            }
        }
    }

    const eventFiles = readdirSync('./events/').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        try {
            const eventName = file.split('.')[0];
            logger.log(`EVENT ${eventName} 已被載入 ✔`, 'log');
            const event = require(`./events/${file}`);
            client.on(eventName, event.bind(null, client));
        }
        catch (error) {
            logger.log(`${error}`, 'error');
        }
    }

    client.on('threadCreate', (thread) => thread.join());

    player.on('stateChange', async (oldState, newState) => {
        console.log(`${oldState.status} => ${newState.status}`);
        const connection = getVoiceConnection('828450904990154802');
        if (newState.status == 'idle' && connection._state.status == 'ready') {
            const data = await music.findOne({});
            if (!data.queue[0]) return;
            const streamURL = data.queue[0].url;
            await music.updateOne({}, { $pop: { queue: -1 } });
            // eslint-disable-next-line prefer-const
            let stream = await play.stream(streamURL);
            // eslint-disable-next-line prefer-const
            let resource = createAudioResource(stream.stream, {
                inputType: stream.type,
            });
            connection.subscribe(player);
            player.play(resource);
            client.channels.cache.find(c => c.id === '832219569501241385').send(`現正播放 \`${data.queue[0].title}\``);
            await misc.updateOne({ key: 'nowplay' }, {
                $set: {
                    value_object: data.queue[0],
                },
            });
        }
    });

    client.login(process.env.DISCORD_TOKEN);
};

init();
