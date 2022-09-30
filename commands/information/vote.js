const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const ms = require('ms');
const vote = require('../../models/vote.js');

exports.run = async (client, message, args) => {
    await message.delete();
    const title = args.shift();
    const time = Date.now() + ms(args.shift());
    const count = parseInt(args.shift(), 10);
    const list = args.map((str) => str.slice(2, -1));
    // eslint-disable-next-line prefer-const
    let Embed = new MessageEmbed()
        .setTitle(`${title}`)
        .setColor('#ffae00');
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯'];
    let i = 0;
    const selectList = [];
    // eslint-disable-next-line no-unused-vars
    let str = '';
    list.forEach((d) => {
        str += `${emojis[i]} ${message.guild.members.cache.get(d)} (0票)\n`;
        selectList.push({
            label: message.guild.members.cache.get(d).user.tag,
            value: d,
            emoji: emojis[i],
        });
        i += 1;
    });
    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('voteSelect')
                .setPlaceholder('投票區 Election Area')
                .addOptions(selectList),
        );
    Embed.setDescription(`最高票: 無\n結束時間: <t:${Math.round(time / 1000)}> <t:${Math.round(time / 1000)}:R>\n\n${str}`);
    const Msg = await message.channel.send({ embeds: [Embed], components: [row] });
    vote.create({
        msg: Msg.id,
        title,
        channel: Msg.channel.id,
        time,
        finished: false,
        candidates: list,
        data: [],
        count,
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Highest',
    description: '創建選舉',
};
