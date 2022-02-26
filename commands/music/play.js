const { createAudioPlayer, NoSubscriberBehavior, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');

exports.run = (client, message) => {

    const Guild = client.guilds.cache.find(g => g.id == '828450904990154802');

    const connection = joinVoiceChannel({
        channelId: '858370818635464774',
        guildId: '828450904990154802',
        adapterCreator: Guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    const resource = createAudioResource('/home/tails/下載/無職/祈りの唄.mp3');
    player.play(resource);

    connection.subscribe(player);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'play',
    category: '音樂',
    description: '播放音樂',
    usage: 'play',
};
