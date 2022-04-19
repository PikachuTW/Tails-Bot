const { MessageEmbed } = require('discord.js');
const { millify } = require('millify');

exports.run = async (client, message, args) => {
    const word = args.slice(0).join(' ');
    if (!word) return message.reply('請提供名稱!');
    const res = await require('yt-search')(word);
    let output = '';
    let count = 1;
    res.videos.slice(0, 8).forEach((v) => {
        output += `\`${count}\` [${v.title}](${v.url}) | ${v.timestamp} ${millify(v.views)} 觀看\n`;
        count += 1;
    });
    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('影片搜尋結果')
                .setColor('#ffae00')
                .setDescription(output)
                .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '搜尋影片',
};
