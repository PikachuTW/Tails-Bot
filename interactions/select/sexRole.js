module.exports = async (client, interaction) => {
    if (interaction.values[0] !== 'clear') {
        await interaction.member.roles.add(interaction.values[0]);
        await interaction.reply({ content: `你已經獲得 ${interaction.guild.roles.cache.find((role) => role.id === interaction.values[0])}`, ephemeral: true });
    } else {
        await interaction.member.roles.remove(['874567548098736129', '874567579539222568', '874567832317354034', '874567837165953074', '874568093542805534']);
        await interaction.reply({ content: '你已經清除所有性別身分組', ephemeral: true });
    }
};