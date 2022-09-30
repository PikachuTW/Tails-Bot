const { MessageEmbed } = require('discord.js');

module.exports = async (client, oldMessage, newMessage) => {
    if (newMessage.guildId !== '828450904990154802') return;
    if (!newMessage.member) return;
    const currentdate = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });

    const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite', 't.me', 'lamtintinfree'];

    if (bannedWords.some((word) => newMessage.content.toLowerCase().includes(word)) && ['650604337000742934', '889358372170792970'].indexOf(newMessage.author.id) === -1 && newMessage.channel.id !== '869948348285722654') {
        newMessage.delete();
        newMessage.channel.send(`:x: ${newMessage.author} 你不允許發送邀請連結!!`);
        return;
    }

    client.channels.cache.get('932992270918119434').send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.member.displayAvatarURL({ format: 'png', dynamic: true }), url: newMessage.url })
                .addField('修改前', oldMessage.content || '`空`')
                .addField('修改後', newMessage.content || '`空`')
                .setImage(oldMessage.attachments.first() ? oldMessage.attachments.first().proxyURL : null)
                .setFooter({ text: `Author: ${newMessage.author.id} | Message ID: ${newMessage.id}\n${currentdate} | 頻道: ${newMessage.channel.name}` }),
        ],
    });

    if (oldMessage.author.bot || !oldMessage.author.tag) return;
    if (oldMessage.content === newMessage.content) return;

    const { editSnipeDB } = client.db;

    const data = editSnipeDB.get(oldMessage.channel.id);

    if (['650604337000742934', '962270937665896478'].indexOf(oldMessage.author.id) !== -1) {
        if (!data) return;
        if (data.snipemsg !== '```已屏蔽```') {
            editSnipeDB.set(oldMessage.channel.id, 'snipetime', currentdate);
        }
        return;
    }

    if (oldMessage.content.toLowerCase().startsWith('t!rs') || ['s?s', 's?'].indexOf(oldMessage.content.toLowerCase()) !== -1 || bannedWords.some((word) => unescape(oldMessage.content.toLowerCase()).includes(word) || oldMessage.content.toLowerCase().includes(word))) return;

    let mc = oldMessage.content;
    if (oldMessage.stickers.first()) {
        mc += `\n[貼圖: ${oldMessage.stickers.first().name}]`;
    }

    editSnipeDB.set(oldMessage.channel.id, {
        snipemsg: mc,
        snipesender: oldMessage.author.tag,
        snipetime: currentdate,
        snipeatt: oldMessage.attachments.size > 0 ? oldMessage.attachments.map((a) => a.proxyURL) : oldMessage.stickers.size > 0 ? oldMessage.stickers.map((a) => a.url) : null,
    });
};
