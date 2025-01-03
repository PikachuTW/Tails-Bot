const { MessageEmbed } = require('discord.js');

module.exports = async (client, oldMessage, newMessage) => {
    if (newMessage.guildId !== '828450904990154802') return;
    if (!newMessage.member) return;
    const currentdate = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite', 't.me', 'lamtintinfree'];

    if (bannedWords.some((word) => newMessage.content.toLowerCase().includes(word)) && !['650604337000742934', '889358372170792970'].includes(newMessage.author.id) && newMessage.channel.id !== '869948348285722654') {
        newMessage.delete();
        newMessage.channel.send(`:x: ${newMessage.author} 你不允許發送邀請連結!!`);
        return;
    }

    if (!oldMessage.content && !newMessage.content) return;
    if (oldMessage.content === newMessage.content) return;
    client.channels.cache.get('932992270918119434').send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.member.displayAvatarURL({ format: 'png', dynamic: true }), url: newMessage.url })
                .addFields([
                    { name: '修改前', value: oldMessage.content || '`空`', inline: false },
                    { name: '修改後', value: newMessage.content || '`空`', inline: false },
                ])
                .setImage(oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null)
                .setFooter({ text: `Author: ${newMessage.author.id} | Message ID: ${newMessage.id}\n${currentdate} | 頻道: ${newMessage.channel.name}` }),
        ],
    });
};
