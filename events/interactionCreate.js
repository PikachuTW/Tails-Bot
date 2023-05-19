module.exports = async (client, interaction) => {
    if (interaction.guildId !== '828450904990154802') return;
    const stamp = client.container.interactionCooldown.get(interaction.member.id) || 0;
    const now = Date.now();
    if (now - stamp < 2000 && interaction.member.id !== '650604337000742934') {
        try {
            await interaction.reply({ content: `冷卻中! (${((2000 - (now - stamp)) / 1000).toPrecision(2)}秒)`, ephemeral: true });
            return;
        } catch { }
    }
    client.container.interactionCooldown.set(interaction.member.id, now);

    let cmd;

    if (interaction.isButton()) {
        cmd = client.container.interactions.button.get(interaction.customId);
    } else if (interaction.isSelectMenu()) {
        cmd = client.container.interactions.select.get(interaction.customId);
    } else if (interaction.isContextMenu()) {
        cmd = client.container.interactions.context.get(interaction.commandName);
    } else if (interaction.isCommand()) {
        cmd = client.container.interactions.slash.get(interaction.commandName);
    } else if (interaction.isModalSubmit()) {
        cmd = client.container.interactions.modal.get(interaction.customId);
    }
    if (cmd) {
        cmd(client, interaction);
    }
};
