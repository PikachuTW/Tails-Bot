const { MessageEmbed } = require('discord.js');
const totem = require('../../models/totem.js');
const roman = require('romans');
const { benefitsdisplay } = require('../../config.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {

  let target = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[0]) || message.member;

  let data = await totem.findOne({ discordid: target.id });
  if (!data) {
    await totem.create({
      discordid: target.id,
      rank: 0,
      cooldownReduce: 0,
      investMulti: 0,
      commandCost: 0,
      giveTax: 0,
      doubleChance: 0
    });
    data = await totem.findOne({ discordid: target.id });
  }

  let totemrank;
  if (target.id === '650604337000742934') {
    totemrank = 'Tails';
  } else if (data.rank == 0) {
    totemrank = '無';
  } else {
    totemrank = `${roman.romanize(data.rank)}`;
  }

  const exampleEmbed = new MessageEmbed()
    .setColor('#ffae00')
    .setTitle(`${target.user.tag} 的Totem`)
    .setDescription(`**圖騰等級** \`${totemrank}\``)
    .addField(`投資出資冷卻`, `\`${benefitsdisplay.cooldownReduce[data.cooldownReduce]}\``, true)
    .addField(`投資出資乘數`, `\`${benefitsdisplay.investMulti[data.investMulti]}\``, true)
    .addField(`指令花費金額`, `\`${benefitsdisplay.commandCost[data.commandCost]}\``, true)
    .addField(`贈與金錢稅金`, `\`${benefitsdisplay.giveTax[data.giveTax]}\``, true)
    .addField(`雙倍金額機會`, `\`${benefitsdisplay.doubleChance[data.doubleChance]}\``, true)
    .setThumbnail(target.displayAvatarURL({ format: 'png' }))
    .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

  message.reply({ embeds: [exampleEmbed] });
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "totem",
  category: "Tails幣",
  description: "查看你的Totem",
  usage: "totem"
};