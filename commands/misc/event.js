const { MessageEmbed } = require('discord.js');
const { DiscordTogether } = require('discord-together');

exports.run = async (client, message, args) => {
    const list = [
        'youtube',
        'youtubedev',
        'poker',
        'betrayal',
        'fishing',
        'chess',
        'chessdev',
        'lettertile',
        'wordsnack',
        'doodlecrew',
        'awkword',
        'spellcast',
        'checkers',
        'puttparty',
        'sketchheads',
        'ocho',
        'puttpartyqa',
        'sketchyartist',
        'land',
        'meme',
        'askaway',
        'bobble',
    ];

    const listEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('活動列表')
        .setDescription(`\`\`\`${list.join(' ')}\`\`\``);

    if (args[0] === 'list') {
        return message.reply({ embeds: [listEmbed] });
    }

    if (!message.member.voice.channel) return message.reply('你需要加入一個語音頻道');

    if (!list.includes(args[0])) {
        message.reply('請輸入有效的活動內容!');
        message.reply({ embeds: [listEmbed] });
        return;
    }

    new DiscordTogether(client).createTogetherCode(message.member.voice.channel.id, args[0]).then(async (invite) => message.channel.send(`${invite.code}`));
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '進行活動',
};
