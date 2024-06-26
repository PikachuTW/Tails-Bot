const translate = require('@iamtraction/google-translate');

module.exports = async (client, interaction) => {
    try {
        const targetMessage = await interaction.channel.messages.fetch(interaction.targetId);
        if (!targetMessage.content) {
            await interaction.reply({ content: '無法翻譯!', ephemeral: false });
        }
        const res = await translate(targetMessage.content, { to: 'zh-tw' });
        await interaction.reply({ content: `**[翻譯]** ${res.text}`, ephemeral: false });
    } catch {
        try {
            await interaction.reply({ content: '翻譯錯誤!', ephemeral: false });
        } catch {}
    }
};
