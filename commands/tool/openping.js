exports.run = async (client, message, args) => {
  const guild = client.guilds.cache.find(guild => guild.id == "828450904990154802");
  const lockchannel = message.guild.channels.cache.find(channel => channel.id === '832219569501241385');
  const lockrole = message.guild.roles.cache.find(role => role.id === "881911118845587477") || await guild.roles.fetch('832219569501241385');
  lockchannel.permissionOverwrites.edit(lockrole, {MENTION_EVERYONE: true});

  message.reply('已經開啟小粉紅的提及所有人權限!')
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["op"],
  permLevel: "Co-Owner"
};

exports.help = {
  name: "openping",
  category: "管理",
  description: "開啟小粉紅提及權限",
  usage: "openping"
};