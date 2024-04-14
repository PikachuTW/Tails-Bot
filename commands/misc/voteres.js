const { MessageEmbed } = require('discord.js');
const vote = require('../../models/vote.js');

exports.run = async (client, message, args) => {
    if (!args[0]) return;
    const res = await vote.findOne({ msg: args[0] });
    if (!res) return message.reply('找不到這場選舉');
    // eslint-disable-next-line prefer-const
    let Embed = new MessageEmbed()
        .setTitle(`${res.title}`)
        .setColor('#ffae00');
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯'];
    let i = 0;
    // eslint-disable-next-line prefer-const
    let highest = [];
    let max = 0;
    res.candidates.forEach((d) => {
        let output;
        let arr = [];
        if (res.data.filter((k) => k.candidate === d).length === 0) {
            output = '無';
        } else {
            arr = res.data.filter((k) => k.candidate === d).map((k) => `<@${k.user}>`);
            output = arr.join(' ');
        }
        Embed.addFields({ name: `${emojis[i]} ${client.users.cache.get(d)?.newName || '已離開'} (${arr.length}票)`, value: `${output}` });
        if (arr.length === max) {
            highest.push(d);
        } else if (arr.length > max) {
            highest = [d];
            max = arr.length;
        }
        i += 1;
    });
    Embed.setDescription(`最高票: ${highest.map((k) => `<@${k}>`).join(' ')}\n結束時間: <t:${Math.round(res.time / 1000)}> <t:${Math.round(res.time / 1000)}:R>`);
    message.channel.send({ embeds: [Embed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '投票詳細結果',
};
