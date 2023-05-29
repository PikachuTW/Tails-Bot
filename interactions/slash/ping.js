module.exports = async (client, interaction) => {
    interaction.reply({
        content: `機器人延遲: \`${Date.now() - interaction.createdTimestamp}\` ms\nApi延遲: \`${Math.round(client.ws.ping)}\` ms`,
    });
};
