module.exports = async (client, interaction) => {
    if (interaction.guildId !== '828450904990154802') return;
    const stamp = client.container.interactionCooldown.get(interaction.member.id) || 0;
    const now = Date.now();
    if (now - stamp < 3000 && interaction.member.id !== '650604337000742934') {
        try {
            await interaction.reply({ content: `冷卻中! (${((3000 - (now - stamp)) / 1000).toPrecision(2)}秒)`, ephemeral: true });
            return;
        } catch { }
    }
    client.container.interactionCooldown.set(interaction.member.id, now);

    if (interaction.isButton()) {
        const cmd = client.container.interactions.button.get(interaction.customId);
        if (cmd) {
            cmd(client, interaction);
        }
    } else if (interaction.isSelectMenu()) {
        const cmd = client.container.interactions.select.get(interaction.customId);
        if (cmd) {
            cmd(client, interaction);
        }
    } else if (interaction.isContextMenu()) {
        const cmd = client.container.interactions.context.get(interaction.commandName);
        if (cmd) {
            cmd(client, interaction);
        }
    }
};
