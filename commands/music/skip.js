const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const play = require('play-dl');
const music = require('../../models/music.js');
const misc = require('../../models/misc.js');

exports.run = async (client, message) => {
    const { player } = client.container;
    if (!message.member.voice.channelId) return message.reply('你不在 <#858370818635464774>!');

    if (message.guild.me.voice.channelId !== '858370818635464774' || !getVoiceConnection('828450904990154802')) {
        return message.reply('我現在沒有在播放歌曲!');
    }

    const data = await music.findOne({});
    if (!data.queue[0]) return message.reply('已經沒有歌曲!');
    await music.updateOne({}, { $pop: { queue: -1 } });
    const stream = await play.stream(data.queue[0].url);
    const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
    });
    player.play(resource);
    client.channels.cache.find((c) => c.id === '948178858610405426').send(`現正播放 \`${data.queue[0].title}\``);
    await misc.updateOne({ key: 'skip' }, { $set: { value_arr: [] } });
    await misc.updateOne({ key: 'nowplay' }, {
        $set: {
            value_object: data.queue[0],
        },
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    description: '跳過音樂',
    usage: 'skip',
};
