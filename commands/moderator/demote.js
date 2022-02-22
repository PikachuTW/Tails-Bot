const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {

  if (!message.member.roles.cache.has('856377783163944970') && message.author.id != '650604337000742934') return message.reply('你不能使用demote!! :joy:');

  let target = targetGet(message, args[0]);
  if (!target) return message.reply('請給予有效目標!');
  if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0) return message.reply("你身分組並沒有比他高 :weary:");

  const list = [
    //dodo
    '886670168594477106',
    //owner
    '901861966585413683',
    '870741338960830544',
    //coowner
    '879001672410599485',
    '854957401362268162',
    //admin
    '879001952510423040',
    '856377783163944970',
    //mod
    '879002165077757964',
    '854959385901531137',
    //staff
    '879002443793448960',
    '832213672695693312'
  ]

  target.roles.remove(list);
  //log
  target.send(`${target} 已經被 ${message.author} 降職`);
  message.reply(`${target} 已經被 ${message.author} 降職`);
  client.channels.cache.find(channel => channel.id === "936311943143247974").send(`${target} 已經被 ${message.author} 降職`)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "demote",
  category: "管理",
  description: "降職管理人員",
  usage: "demote <@成員>"
};