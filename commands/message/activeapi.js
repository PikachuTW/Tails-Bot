const level = require('../../models/level.js');
const { targetGet } = require('../../modules/functions.js');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const QuickChart = require('quickchart-js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args[0]) || message.member;

    let today, s_active, active, week, total;

    const levelData = await level.findOne({ 'discordid': target.id });
    if (!levelData) {
        today = 0, s_active = 0, active = 0, week = 0, total = 0;

        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${target.user.tag} 的訊息資料`)
                    .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                    .addFields([
                        { name: '今日訊息量', value: '`0`', inline: true },
                        { name: '兩日訊息量', value: '`0`', inline: true },
                        { name: '三日訊息量', value: '`0`', inline: true },
                        { name: '星期訊息量', value: '`0`', inline: true },
                        { name: '全部訊息量', value: '`0`', inline: true },
                    ])
                    .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
            ],
        });

    }
    else {
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);

        try {
            week = levelData.daily.filter(d => d.date >= nowStamp - 6).map(d => d.count).reduce((a, b) => a + b);
        }
        catch {
            week = 0;
        }
        try {
            today = levelData.daily.filter(d => d.date == nowStamp).map(d => d.count).reduce((a, b) => a + b);
        }
        catch {
            today = 0;
        }
        try {
            s_active = levelData.daily.filter(d => d.date >= nowStamp - 1).map(d => d.count).reduce((a, b) => a + b);
        }
        catch {
            s_active = 0;
        }

        try {
            active = levelData.daily.filter(d => d.date >= nowStamp - 2).map(d => d.count).reduce((a, b) => a + b);
        }
        catch {
            active = 0;
        }

        try {
            total = levelData.daily.map(d => d.count).reduce((a, b) => a + b);
        }
        catch {
            total = 0;
        }

        const res = await level.aggregate([
            { $match: { 'discordid': target.id } },
            { $unwind: '$daily' },
            { $sort: { _id: 1 } },
        ]);

        let forCount = res.length;

        const check = res[0].daily.date;

        for (let i = 1; i < forCount; i++) {
            if (res[i].daily.date != check + i) {
                res.splice(i, 0, { daily: { date: check + i, count: 0 } });
                forCount++;
            }
        }

        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        const chart = new QuickChart();

        chart.setWidth(500);
        chart.setHeight(300);

        chart.setConfig({
            type: 'line',
            data: {
                labels: res.map(d => `${new Date((d.daily.date) * 86400000).getMonth() + 1}/${new Date((d.daily.date) * 86400000).getDate()}(${weekDays[new Date((d.daily.date) * 86400000).getDay()]})`),
                datasets: [{
                    label: '訊息量',
                    fill: false,
                    borderColor: '#ffae00',
                    pointBackgroundColor: '#ffae00',
                    data: res.map(d => d.daily.count),
                }],
            },
            options: {
                legend: {
                    display: false,
                },
                title: {
                    display: true,
                    text: `${target.user.tag} 的訊息資料圖表`,
                },
            },
        });

        const rankRes = await level.aggregate([
            { $unwind: '$daily' },
            {
                $group: {
                    _id: '$discordid',
                    total: { $sum: '$daily.count' },
                },
            },
            { $sort: { total: -1 } },
        ]);

        const imageGen = new MessageAttachment(chart.getUrl(), `${target.id}_chart.png`);

        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setTitle(`${target.user.tag} 的訊息資料`)
                    .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                    .addFields([
                        { name: '今日訊息量', value: `\`${today}\``, inline: true },
                        { name: '兩日訊息量', value: `\`${s_active}\``, inline: true },
                        { name: '三日訊息量', value: `\`${active}\``, inline: true },
                        { name: '星期訊息量', value: `\`${week}\``, inline: true },
                        { name: '全部訊息量', value: `\`${total}\``, inline: true },
                        { name: '總排名', value: `\`${rankRes.filter(d => d.total >= total).length}\``, inline: true },
                    ])
                    .setImage(`attachment://${target.id}_chart.png`)
                    .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' }),
            ],
            files: [imageGen],
        });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['rank', 'r'],
    permLevel: 'User',
};

exports.help = {
    name: 'activeapi',
    category: '訊息',
    description: '獲取你的訊息量',
    usage: 'activeapi',
};