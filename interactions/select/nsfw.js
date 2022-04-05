module.exports = async (client, interaction) => {
    if (interaction.values[0] === 'remove') {
        await interaction.reply({ content: '你已經移除 <@&943152949511729193>', ephemeral: true });
        interaction.member.roles.remove('943152949511729193');
    } else {
        await interaction.reply({ content: '你已經獲得 <@&943152949511729193>', ephemeral: true });
        interaction.member.roles.add('943152949511729193');
    }
};
