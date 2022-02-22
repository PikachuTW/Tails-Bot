exports.run = async (client, message) => {
  await message.reply({ content: "機器人已關閉", allowedMentions: { repliedUser: "true" }});
  await Promise.all(client.container.commands.map(cmd => {
    delete require.cache[require.resolve(`./${cmd.help.name}.js`)];
    client.container.commands.delete(cmd.help.name);
  }));
  process.exit(0);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Tails"
};

exports.help = {
  name: "shutdown",
  category: "系統",
  description: "關閉機器人",
  usage: "shutdown"
};