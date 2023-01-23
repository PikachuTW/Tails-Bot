module.exports = async (client, interaction) => {
    if (interaction.values[0] !== 'clear') {
        await interaction.member.roles.add(interaction.values[0]);
        await interaction.reply({ content: `你已經獲得 ${interaction.guild.roles.cache.get(interaction.values[0])}`, ephemeral: true });
    } else {
        await interaction.member.roles.remove(['856410483120799744', '856410560622362633', '856410586879229982', '856410631494565928', '856412324676108289', '995519246811541604', '1008055435212898335']);
        await interaction.reply({ content: '你已經清除所有國家/地區身分組', ephemeral: true });
    }
};
