module.exports = async (client, interaction) => {
    // eslint-disable-next-line no-underscore-dangle
    const Options = interaction.options._hoistedOptions;
    const target = Options[0].member;
    const msg = Options[1].value;
    const webhooks = await interaction.channel.fetchWebhooks();
    let webhook = webhooks.find((d) => d.name === 'Tails Bot');
    if (!webhook) {
        webhook = await interaction.channel.createWebhook('Tails Bot');
    }
    await webhook.send({
        content: msg,
        username: target.nickname || target.user.username,
        avatarURL: target.displayAvatarURL(),
    });
    await interaction.reply({ content: '發送成功!', ephemeral: true });
};
