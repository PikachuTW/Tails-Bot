module.exports = async (client, interaction) => {
    const ping = Date.now() - interaction.createdTimestamp;
    const apiping = Math.round(client.ws.ping);
    interaction.reply({
        content: `機器人延遲: \`${ping}\` ms\nApi延遲: \`${apiping}\` ms`,
    });
};
