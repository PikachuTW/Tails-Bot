module.exports = async (client, interaction) => {
    console.log(interaction);
    const msg = await interaction.guild.channels.cache.get('1088875867926695967').send(`**投稿人: ${interaction.member.user.tag}**\`\`\`投稿時間: ${new Date(interaction.createdTimestamp).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\n\n${interaction.fields.getTextInputValue('content')}\`\`\``);
    await msg.react('✅');
    await interaction.reply({
        content: '你的投稿已經送出，將會盡速審核!!', ephemeral: true,
    });
};
