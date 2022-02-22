const { MessageEmbed } = require('discord.js');
const { DiscordTogether } = require('discord-together');

exports.run = async (client, message, args) => {
  const list = [
    'youtube',
    'poker',
    'chess',
    'checkers',
    'betrayal',
    'fishing',
    'lettertile',
    'wordsnack',
    'doodlecrew',
    'spellcast',
    'awkword',
    'puttparty'
  ]

  const listEmbed = new MessageEmbed()
    .setColor('#ffae00')
    .setTitle('活動列表')
    .setDescription(`\`\`\`${list.join('\n')}\`\`\``);

  if(args[0]=='list'){
    return message.reply({ embeds: [listEmbed] });
  }

  client.discordTogether = new DiscordTogether(client);

  if (!message.member.voice.channel) return message.reply('你需要加入一個語音頻道');

  if (list.indexOf(args[0])==-1) {
    message.reply(`請輸入有效的活動內容!`)
    message.reply({ embeds: [listEmbed] });
    return;
  }


  client.discordTogether.createTogetherCode(message.member.voice.channel.id, args[0]).then(async invite => {
    return message.channel.send(`${invite.code}`);
  })
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "event",
  category: "資訊",
  description: "進行活動",
  usage: "event"
};