const { permlevel } = require("../../modules/functions.js");
const config = require('../../config.js');

exports.run = async (client, message) => {
  const level = permlevel(message);
  const friendly = config.permLevels.find(l => l.level === level).name;
  message.reply({ content: `你的權限等級為: ${friendly} (${level})`, allowedMentions: { repliedUser: "true" } });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["perm"],
  permLevel: "User"
};

exports.help = {
  name: "permlevel",
  category: "資訊",
  description: "回傳你目前的權限等級",
  usage: "permlevel"
};
