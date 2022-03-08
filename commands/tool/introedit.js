const { MessageEmbed } = require('discord.js');
const introduction = require('../../models/introduction.js');

exports.run = async (client, message, args) => {

    const introinput = args.slice(0).join(' ');

    if (!introinput) {
        return message.reply('請提供內容');
    }

    let introdata = await introduction.findOne({ discordid: message.member.id });

    if (!introdata) {
        await introduction.create({
            discordid: message.member.id,
            intro: '無',
        });
        introdata = await introduction.findOne({ discordid: message.member.id });
    }

    if (introinput.length > 100) {
        return message.reply('給予的字元數必須小於等於100!');
    }

    await introduction.findOneAndUpdate({ 'discordid': message.member.id }, { $set: { 'intro': introinput } });

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(`${message.member.user.tag} 的自我介紹調整!`)
        .setDescription(`<@${message.member.id}>的暱稱已經從 \`${introdata.intro}\` 改成 \`${introinput}\``);

    message.reply({ embeds: [exampleEmbed] });
    client.channels.cache.find(channel => channel.id === '935773294278365184').send({ embeds: [exampleEmbed] });
};

exports.conf = {
    aliases: ['editintro'],
    permLevel: 'User',
};

exports.help = {
    name: 'introedit',
    description: '修改你的個人資料',
    usage: 'introedit',
};