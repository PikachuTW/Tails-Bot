const { MessageAttachment } = require('discord.js');
const request = require('request');

exports.run = async (client, message, args) => {
    const input = args.join('');
    if (!input) return message.reply('你沒有提供訊息!');

    const options = {
        url: 'https://chimeragpt.adventblocks.cc/api/v1/audio/tts/generation',
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.CGPT}` },
        json: { text: input },
    };
    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            message.reply('An error occurred while processing your request.');
            return;
        }
        const audio = new MessageAttachment(body.url, `ltt_${message.author.newName}.mp3`);
        message.reply({ files: [audio] });
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '',
};
