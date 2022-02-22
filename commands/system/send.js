exports.run = async (client, message, args) => { 
  message.delete();
  let sentence = args.slice(0).join(" ");
  message.channel.send(sentence);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['say'],
  permLevel: "Tails"
};

exports.help = {
  name: "send",
  category: "訊息",
  description: "傳送任何訊息",
  usage: "send"
};