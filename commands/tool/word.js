const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const num = Number(args[0]);
    if (!num) return message.reply('你需要輸入一個1-6, 11的等級');
    if ([1, 2, 3, 4, 5, 6, 11].indexOf(num) === -1) return message.reply('你需要輸入一個1-6, 11的等級');
    const data = client.word[`${num}`];
    const res = data[Math.floor(Math.random() * data.length)];
    const cd = client.container.wordcd.get(message.author.id);
    if (cd === true) return;
    client.container.wordcd.set(message.author.id, true);
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(`${res[0].slice(0, 1)}___${res[0].slice(-1)} ${res[2]} (${res[1]}.)`),
        ],
    });
    const filter = (m) => m.content.toLowerCase() === res[0].toLowerCase() && m.channelId === message.channelId;
    message.channel.awaitMessages({
        filter, max: 1, time: 25000, errors: ['time'],
    })
        .then((collected) => {
            collected.first().reply(`恭喜答對! 詳解: ${res[0]} ${res[2]} (${res[1]}.)`);
            client.container.wordcd.set(message.author.id, false);
        })
        .catch((collected) => {
            if (collected.size === 0) {
                message.channel.send(`${message.member} 詳解: ${res[0]} ${res[2]} (${res[1]}.)`);
            }
            client.container.wordcd.set(message.author.id, false);
        });
};

exports.conf = {
    aliases: ['w'],
    permLevel: 'User',
    description: '中翻英測驗',
};
