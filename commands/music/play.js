const { createAudioResource, joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const music = require('../../models/music.js');
const play = require('play-dl');
const misc = require('../../models/misc.js');

exports.run = async (client, message, args) => {
    const { player } = client.container;
    if (!message.member.voice.channelId) return message.reply('你不在 <#858370818635464774>!');

    // if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId) return message.reply('請加入 <#858370818635464774>!');
    const link = args.slice(0).join(' ');
    if (!link) return message.reply('請提供你要搜尋的音樂!');
    let songInfo;
    try {
        songInfo = await play.video_info(`${link}`);
    }
    catch {
        return message.reply('無法解析你要尋找的音樂!');
    }
    const song = {
        title: songInfo.video_details.title,
        url: songInfo.video_details.url,
        requestBy: message.author.id,
        duration: songInfo.video_details.durationRaw,
    };

    const bannedWords = ['never gonna give you up', 'rick', 'roll', '大悲咒', '淫叫', 'earrape', '小玉', '聖結石', '放火'];
    if (bannedWords.some(word => song.title.toLowerCase().includes(word))) {
        return message.reply('你要放啥蠢歌 :frog:');
    }

    if (message.author.id != '650604337000742934') {
        const list = await music.findOne({});
        if (list.queue.filter(d => d.requestBy === message.author.id).length >= 5) {
            return message.reply('你已經點超過5首歌了!');
        }
        if (list.queue.find(d => d.url == song.url)) {
            return message.reply('已經有重複的歌存在!');
        }
        if (message.member.voice.selfDeaf) {
            return message.reply('你自己都不想聽了還叫別人聽 :frog:');
        }
    }

    if (message.guild.me.voice.channelId !== '858370818635464774' || !getVoiceConnection('828450904990154802')) {
        joinVoiceChannel({
            channelId: '858370818635464774',
            guildId: '828450904990154802',
            adapterCreator: client.guilds.cache.find(g => g.id === '828450904990154802').voiceAdapterCreator,
        });
    }

    const connection = getVoiceConnection('828450904990154802');

    await music.updateOne({}, { $push: { 'queue': song } });

    if (player.state.status === 'idle') {
        const data = await music.findOne({});
        await music.updateOne({}, { $pop: { queue: -1 } });
        // eslint-disable-next-line prefer-const
        let stream = await play.stream(data.queue[0].url);
        // eslint-disable-next-line prefer-const
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type,
        });
        connection.subscribe(player);
        player.play(resource);
        message.reply(`已經新增到播放清單! \`${songInfo.video_details.title}\``);
        client.channels.cache.find(c => c.id === '948178858610405426').send(`現正播放 \`${data.queue[0].title}\``);
        await misc.updateOne({ key: 'skip' }, { $set: { value_arr: [] } });
        await misc.updateOne({ key: 'nowplay' }, {
            $set: {
                value_object: data.queue[0],
            },
        });
    }
    else {
        message.reply(`已經新增到播放清單! \`${songInfo.video_details.title}\``);
    }
};

exports.conf = {
    aliases: ['p'],
    permLevel: 'User',
};

exports.help = {
    name: 'play',
    description: '播放音樂',
    usage: 'play',
};
