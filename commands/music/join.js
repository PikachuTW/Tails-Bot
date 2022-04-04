const { createAudioResource, joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');
const music = require('../../models/music.js');
const misc = require('../../models/misc.js');

exports.run = async (client, message) => {
    const { player } = client.container;
    if (!message.member.voice.channelId) return message.reply('你不在 <#858370818635464774>!');
    if (message.guild.me.voice.channelId !== '858370818635464774' || !getVoiceConnection('828450904990154802')) {
        joinVoiceChannel({
            channelId: '858370818635464774',
            guildId: '828450904990154802',
            adapterCreator: client.guilds.cache.find((g) => g.id === '828450904990154802').voiceAdapterCreator,
        });
    } else {
        message.reply('我已經在語音頻道了!');
    }

    const connection = getVoiceConnection('828450904990154802');

    if (player.state.status === 'idle') {
        const data = await music.findOne({});
        if (!data.queue[0]) return message.reply('現在沒有任何歌曲');
        await music.updateOne({}, { $pop: { queue: -1 } });
        const stream = await play.stream(data.queue[0].url);
        const resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });
        connection.subscribe(player);
        player.play(resource);
        client.channels.cache.find((c) => c.id === '948178858610405426').send(`現正播放 \`${data.queue[0].title}\``);
        await misc.updateOne({ key: 'skip' }, { $set: { value_arr: [] } });
        await misc.updateOne({ key: 'nowplay' }, {
            $set: {
                value_object: data.queue[0],
            },
        });
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    description: '加入語音頻道',
    usage: 'join',
};
