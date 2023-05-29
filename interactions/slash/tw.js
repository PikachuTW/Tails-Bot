const translate = require('@iamtraction/google-translate');

module.exports = async (client, interaction) => {
    const input = interaction.options.data[0].value;
    const res = await translate(input, { to: 'zh-tw' });
    interaction.reply({ content: `**[翻譯]** ${res.text}`, allowedMentions: { parse: ['users'] } });
};
