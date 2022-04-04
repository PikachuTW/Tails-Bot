const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    const target = message.mentions.members.first() || message.guild.members.cache.find((member) => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');

    const res = message.guild.roles.cache.filter((r) => r.name.toLowerCase().includes(args.slice(1).join(' ').toLowerCase())).map((r) => r);

    if (res.length === 0) return message.reply('未找到任何結果');
    if (res.length === 1) {
        target.roles.add(res[0].id);
        const successembed = new MessageEmbed()
            .setTitle(`${target.user.tag} 已經獲得身分組!`)
            .setColor('#ffae00')
            .setDescription(`已經給予 ${target} ${res[0]}`)
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
        return message.reply({ embeds: [successembed] });
    }
    let text = '';
    for (let i = 0; i < res.length; i++) {
        text += `\`${i + 1}\` ${res[i]}\n`;
    }
    const embed = new MessageEmbed()
        .setTitle(`找到 ${res.length} 個相關身分組`)
        .setColor('#ffae00')
        .setDescription(text)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({ embeds: [embed] });

    const filter = (m) => (parseInt(m.content, 10) >= 1 && parseInt(m.content, 10) <= res.length && m.author.id === message.author.id) || m.content === 'cancel';
    const collector = message.channel.createMessageCollector({ filter, time: 15000 });

    let done = false;

    collector.on('collect', (m) => {
        if (m.content === 'cancel') return collector.stop();
        done = true;
        collector.stop();
        target.roles.add(res[parseInt(m.content, 10) - 1].id);

        const successembed = new MessageEmbed()
            .setTitle(`${target.user.tag} 已經獲得身分組!`)
            .setColor('#ffae00')
            .setDescription(`已經給予 ${target} ${res[parseInt(m.content, 10) - 1]}`)
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
        return message.reply({ embeds: [successembed] });
    });

    collector.on('end', () => {
        if (done === true) return;
        return message.reply('已經取消指令!');
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    description: '給予成員身分組',
    usage: 'role',
};
