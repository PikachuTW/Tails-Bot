const { createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const music = require('../../models/music.js');
const play = require('play-dl');
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
    // eslint-disable-next-line prefer-const
    let stream = await play.stream(data.queue[0].url);
    // eslint-disable-next-line prefer-const
    let resource = createAudioResource(stream.stream, {
        inputType: stream.type,
    });
    player.play(resource);
    client.channels.cache.find(c => c.id === '948178858610405426').send(`現正播放 \`${data.queue[0].title}\``);
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
    name: 'skip',
    description: '跳過音樂',
    usage: 'skip',
};
