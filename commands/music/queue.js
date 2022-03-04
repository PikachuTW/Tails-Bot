const music = require('../../models/music.js');
const misc = require('../../models/misc.js');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    let res = '';
    const np = await misc.findOne({ key: 'nowplay' });
    const q = await music.findOne({});
    res += `\`now\` [${np.value_object.title}](${np.value_object.url}) | ${np.value_object.duration} ${client.users.cache.find(u => u.id === np.value_object.requestBy).tag}\n`;
    const len = q.queue.length < 9 ? q.queue.length : 9;
    for (let i = 0; i < len; i++) {
        res += `\`${i + 1}\` [${q.queue[i].title}](${q.queue[i].url}) | ${q.queue[i].duration} ${client.users.cache.find(u => u.id === q.queue[i].requestBy).tag}\n`;
    }

    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('播放清單')
                .setColor('#ffae00')
                .setDescription(res)
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
        ],
    });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['q'],
    permLevel: 'User',
};

exports.help = {
    name: 'queue',
    description: '查看目前播放清單',
    usage: 'queue',
};
