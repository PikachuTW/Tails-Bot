const { MessageEmbed } = require('discord.js');
const marry = require('../../models/marry.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    let res = await marry.findOne({ users: message.member.id });
    let ensure = await marry.findOne({ users: target.id });
    if (res) return message.reply('你早已經擁有婚姻!');
    if (ensure) return message.reply('對方早已經擁有婚姻!');
    if (!target) return message.reply('請提供對象!');
    if (args[1] !== 'm' && args[1] !== 'f') return message.reply('請提供你的性別!');
    if (target.id === message.author.id) return message.reply('你不能跟自己結婚');
    let list;
    if (args[1] === 'm') { list = [message.member, target]; } else { list = [target, message.member]; }
    message.channel.send({
        content: `${target}`,
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.tag} 向你發起了求婚!`)
                .setDescription(
                    `你是否同意與 ${message.member} 結婚?\n若同意請輸入: 我願意、我愿意\n不同意請輸入: 不願意、不愿意`,
                ),
        ],
    });
    const filter = (m) => ['我願意', '我愿意', '不願意', '不同意', '不愿意'].indexOf(m.content) !== -1 && m.channelId === message.channelId && m.author.id === target.id;
    message.channel.awaitMessages({
        filter, max: 1, time: 25000, errors: ['time'],
    })
        .then(async (collected) => {
            if (['我願意', '我愿意'].indexOf(collected.first().content) !== -1) {
                res = await marry.findOne({ users: message.member.id });
                ensure = await marry.findOne({ users: target.id });
                if (res) return message.reply('你早已經擁有婚姻!');
                if (ensure) return message.reply('對方早已經擁有婚姻!');
                collected.first().reply(
                    `新郎 ${list[0]} 新娘 ${list[1]}\n\n現在你們兩個人在上帝和眾人面前已經締結這重要的盟約，你們當時常照約彼此相待，方能增加你們的福份，並使人得益處。現在我奉聖父、聖子、聖靈的名為你們二人證婚成為夫婦、上帝所配合的，人不可分開。願耶和華賜福保護你們。願耶和華的臉光照你們。願耶和華歡喜的臉看顧你們，賜你們平安。阿們。」`,
                );
                await marry.create({ users: list.map((v) => v.id), started: Date.now(), points: 0 });
            } else {
                collected.first().reply('已經取消');
            }
        })
        .catch(() => {
            message.channel.send('已經取消');
        });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '結婚',
};
