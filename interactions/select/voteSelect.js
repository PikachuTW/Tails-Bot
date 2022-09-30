const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const vote = require('../../models/vote.js');

module.exports = async (client, interaction) => {
    const { message } = interaction;
    const Value = interaction.values[0];
    // eslint-disable-next-line prefer-const
    let res = await vote.findOne({ msg: message.id });
    if (!res) {
        await interaction.reply({ content: '找不到這場選舉', ephemeral: true });
        return;
    }
    if (res.finished) {
        await interaction.reply({ content: '這場選舉已經結束', ephemeral: true });
        return;
    }
    if (res.data.filter((element) => element.user === interaction.member.id).length >= res.count) {
        await interaction.reply({ content: '你已經投過票', ephemeral: true });
        return;
    }

    if (res.data.find((element) => element.user === interaction.member.id && element.candidate === Value)) {
        await interaction.reply({ content: `你已經投過 <@${Value}> 了!`, ephemeral: true });
        return;
    }

    await interaction.reply({ content: `你已經投給 <@${Value}>`, ephemeral: true });
    await vote.updateOne(
        { msg: message.id },
        {
            $push: {
                data: {
                    user: interaction.member.id,
                    candidate: Value,
                },
            },
        },
    );
    res.data.push({
        user: interaction.member.id,
        candidate: Value,
    });
    // eslint-disable-next-line prefer-const
    let Embed = new MessageEmbed()
        .setTitle(`${res.title}`)
        .setColor('#ffae00');
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯'];
    let i = 0;
    // eslint-disable-next-line prefer-const
    let selectList = [];
    // eslint-disable-next-line prefer-const
    let highest = [];
    let max = 0;
    // eslint-disable-next-line no-unused-vars
    let str = '';
    res.candidates.forEach((d) => {
        const arr = res.data.filter((k) => k.candidate === d);
        str += `${emojis[i]} ${message.guild.members.cache.get(d)} (${arr.length}票)\n`;
        if (arr.length === max) {
            highest.push(d);
        } else if (arr.length > max) {
            highest = [d];
            max = arr.length;
        }
        selectList.push({
            label: message.guild.members.cache.get(d).user.tag,
            value: d,
            emoji: emojis[i],
        });
        i += 1;
    });
    Embed.setDescription(`最高票: ${highest.map((k) => message.guild.members.cache.get(k)).join(' ')}\n結束時間: <t:${Math.round(res.time / 1000)}> <t:${Math.round(res.time / 1000)}:R>\n\n${str}`);
    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('voteSelect')
                .setPlaceholder('投票區 Election Area')
                .addOptions(selectList),
        );
    await message.edit({ embeds: [Embed], components: [row] });
};
