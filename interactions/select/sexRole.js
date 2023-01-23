module.exports = async (client, interaction) => {
    if (interaction.values[0] !== 'clear') {
        if ((interaction.member.roles.cache.has('874567548098736129') && interaction.values[0] === '874567579539222568') || (interaction.member.roles.cache.has('874567579539222568') && interaction.values[0] === '874567548098736129')) {
            await interaction.reply({ content: 'sb你是雙性合成人嗎🤢', ephemeral: true });
            return;
        }
        await interaction.member.roles.add(interaction.values[0]);
        await interaction.reply({ content: `你已經獲得 ${interaction.guild.roles.cache.get(interaction.values[0])}`, ephemeral: true });
    } else {
        await interaction.member.roles.remove(['874567548098736129', '874567579539222568']);
        await interaction.reply({ content: '你已經清除所有性別身分組', ephemeral: true });
    }
};
