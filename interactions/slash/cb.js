const {
    Modal, TextInputComponent, MessageActionRow,
} = require('discord.js');

module.exports = async (client, interaction) => {
    const modal = new Modal()
        .setCustomId('cbSubmit')
        .setTitle('林天天靠北匿名投稿');
    const contentInput = new TextInputComponent()
        .setCustomId('content')
        .setLabel('投稿內容')
        .setStyle('PARAGRAPH')
        .setRequired(true)
        .setMaxLength(1900);
    modal.addComponents(new MessageActionRow().addComponents(contentInput));
    await interaction.showModal(modal);
};
