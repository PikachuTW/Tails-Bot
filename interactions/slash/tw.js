const translate = require('@iamtraction/google-translate');

module.exports = async (client, interaction) => {
    const input = interaction.options.data[0].value;
    translate(input, { to: 'zh-tw' }).then((res) => {
        interaction.reply({ content: `**[翻譯]** ${res.text}`, allowedMentions: { parse: ['users'] } });
    }).catch((err) => {
        console.error(err);
    });
};
