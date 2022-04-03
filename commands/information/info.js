const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const os = require('os');
const cpuStat = require('cpu-stat');
const moment = require('moment');
require('moment-duration-format');

exports.run = (client, message) => {
    const duration = moment.duration(client.uptime).format(' D [天], H [小時], m [分], s [秒]');
    const botinfo = new MessageEmbed()
        .setAuthor({ name: client.user.username, iconURL: 'https://i.imgur.com/IOgR3x6.png' })
        .setTitle('__**詳細資訊:**__')
        .setColor('#ffae00')
        .addField('⏳ 記憶體使用量', `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``, true)
        .addField('⌚️ 上線時間', `\`${duration}\``, true)
        .addField('👾 Discord.js', `\`v${Discord.version}\``, true)
        .addField('🤖 Node', `\`${process.version}\``, true)
        .addField('API 延遲', `\`${client.ws.ping}ms\``, true)
        .addField('🤖 CPU 型號', `\`${os.cpus().map((i) => `${i.model}`)[0]}\``)
        .addField('🤖 CPU 時脈', `\`${cpuStat.avgClockMHz()}MHz\``, true)
        .addField('🤖 Arch', `\`${os.arch()}\``, true)
        .addField('💻 系統平台', `\`\`${os.platform()}\`\``, true)
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });
    message.reply({
        embeds: [botinfo],
    });
};

exports.conf = {
    aliases: ['botinfo'],
    permLevel: 'User',
};

exports.help = {
    name: 'info',
    description: '回傳機器人數據',
    usage: 'info',
};
