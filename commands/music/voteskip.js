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
    const voteList = await misc.findOne({ key: 'skip' });
    const peopleVoted = Math.ceil((client.channels.cache.find((c) => c.id === '858370818635464774').members.map((m) => m).length - 1) * (3 / 5));
    if (!voteList.value_arr.find((d) => d === message.author)) {
        await misc.updateOne({ key: 'skip' }, { $push: { value_arr: message.author.id } });
        if (voteList.value_arr.length + 1 < peopleVoted) {
            return message.reply(`目前已經有 \`${voteList.value_arr.length + 1}\` 投票，需要 \`${peopleVoted}\` 票才可Skip`);
        }
    } else if (voteList.value_arr.length < peopleVoted) {
        return message.reply(`目前已經有 \`${voteList.value_arr.length}\` 投票，需要 \`${peopleVoted}\` 票才可Skip`);
    }
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
    permLevel: 'User',
};

exports.help = {
    description: '投票跳過音樂',
    usage: 'voteskip',
};
