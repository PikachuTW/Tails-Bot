const gis = require('g-i-s');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    if (message.channelId !== '975025966990626816' && !message.member.roles.cache.has('870741338960830544') && !message.member.roles.cache.has('989362072062165052')) return message.reply('此指令僅限 <#975025966990626816> 使用，以便管理');
    const input = args.join(' ');
    gis(input, (error, results) => {
        if (error) {
            message.reply(`\`\`\`${error}\`\`\``.slice(0, 2000));
        } else if (results.length === 0) {
            message.reply('沒有搜尋結果!');
        } else {
            message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#ffae00')
                        // eslint-disable-next-line no-bitwise
                        .setImage(results[Math.random() * results.length | 0].url),
                ],
            });
        }
    });
};

exports.conf = {
    aliases: ['randomimg', 'rimg', 'imgr', 'imgrandom', 'imagerandom'],
    permLevel: 'User',
    description: '搜尋圖片',
};
