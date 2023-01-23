const { MessageEmbed } = require('discord.js');
const marry = require('../../models/marry.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;
    const res = await marry.findOne({ users: target.id });
    if (!res) {
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${target.user.tag} 的婚姻狀態`)
                    .setDescription('```無```')
                    .setFooter({ text: '若要新增你的婚姻狀態，請使用 t!proposal <你的求婚對象> <你的性別(m/f)> ' }),
            ],
        });
    } else {
        const man = message.guild.members.cache.get(res.users[0]);
        const woman = message.guild.members.cache.get(res.users[1]);
        const time = Math.round(res.started / 1000);
        const k = Math.floor(Date.now() / 1000 + 600);
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${target.user.tag} 的婚姻狀態`)
                    .setDescription(`**男方** ${man}\n**女方** ${woman}\n結婚紀念日: <t:${time}> <t:${time}:R>\n愛情點數: ${res.points}`)
                    .addFields([
                        { name: '愛情行為冷卻時間 (還沒製作完成)', value: `親吻 <t:${k}:R>\n性愛 <t:${k}:R>\n擁抱 <t:${k}:R>\n約會 <t:${k}:R>` }]),
            ],
        });
    }
};

exports.conf = {
    aliases: ['marriage'],
    permLevel: 'User',
    description: '結婚',
};
