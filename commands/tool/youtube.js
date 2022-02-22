const { DiscordTogether } = require('discord-together');

exports.run = async (client, message) => {
  client.discordTogether = new DiscordTogether(client);

  if (!message.member.voice.channel) return message.reply('你需要加入一個語音頻道')

  client.discordTogether.createTogetherCode(message.member.voice.channel.id, 'youtube').then(async invite => {
    return message.channel.send(`${invite.code}`);
  })
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["yt"],
  permLevel: "User"
};

exports.help = {
  name: "youtube",
  category: "資訊",
  description: "觀看Youtube影片",
  usage: "youtube"
};