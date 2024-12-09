const { MessageEmbed, MessageAttachment } = require('discord.js');
const QuickChart = require('quickchart-js');
const level = require('../../models/level.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args) || message.member;

    // let days = args[1];
    // if (!days) days = 250;
    // days = Number(days);
    // if (!days) days = 250;
    // if (days < 0 || days > 250) return message.reply('應該介於1到250天');
    const days = 250;

    let today; let sActive; let active; let week; let total;

    const levelData = await level.findOne({ discordid: target.id });
    const { daily } = levelData;
    if (!levelData || !daily || daily.length === 0) {
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
    } else {
        const nowStamp = Math.floor((Date.now() + 28800000) / 86400000);

        week = daily.filter((d) => d.date >= nowStamp - 6).map((d) => d.count).reduce((a, b) => a + b, 0);
        today = daily.filter((d) => d.date === nowStamp).map((d) => d.count).reduce((a, b) => a + b, 0);
        sActive = daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0);
        active = daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0);
        total = levelData.daily.map((d) => d.count).reduce((a, b) => a + b, 0);

        const res = await level.aggregate([
            { $match: { discordid: target.id } },
            { $unwind: '$daily' },
            { $sort: { _id: 1 } },
        ]);

        let forCount = res.length;

        const check = res[0].daily.date;

        for (let i = 1; i < forCount; i++) {
            if (res[i].daily.date !== check + i) {
                res.splice(i, 0, { daily: { date: check + i, count: 0 } });
                forCount += 1;
            }
        }

        let forData = res[res.length - 1].daily.date + 1;

        if (nowStamp - check + 1 !== res.length) {
            for (let i = 0; i < nowStamp - check + 1 - res.length; i++) {
                res.push({ daily: { date: forData, count: 0 } });
                forData += 1;
            }
        }

        const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

        const conf = {
            type: 'line',
            data: {
                labels: res.map((d) => `${new Date((d.daily.date) * 86400000).getMonth() + 1}/${new Date((d.daily.date) * 86400000).getDate()}(${weekDays[new Date((d.daily.date) * 86400000).getDay()]})`).slice(-days),
                datasets: [{
                    label: '訊息量',
                    fill: false,
                    borderColor: '#ffae00',
                    pointBackgroundColor: '#ffae00',
                    data: res.map((d) => d.daily.count).slice(-days),
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
        };

        const chart = new QuickChart()
            .setWidth(500)
            .setHeight(300)
            .setConfig(conf);

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
                        { name: '兩日訊息量', value: `\`${sActive}\``, inline: true },
                        { name: '三日訊息量', value: `\`${active}\``, inline: true },
                        { name: '星期訊息量', value: `\`${week}\``, inline: true },
                        { name: '全部訊息量', value: `\`${total}\``, inline: true },
                        { name: '總排名', value: `\`${rankRes.filter((d) => d.total >= total).length}\``, inline: true },
                    ])
                    .setImage(`attachment://${target.id}_chart.png`),
            ],
            files: [imageGen],
        });
    }
};

exports.conf = {
    aliases: ['oldrank', 'or'],
    permLevel: 'User',
    description: '獲取你的訊息量',
};
