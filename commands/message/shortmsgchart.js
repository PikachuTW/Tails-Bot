/* eslint-disable no-underscore-dangle */
const { MessageEmbed, MessageAttachment } = require('discord.js');
const level = require('../../models/level.js');
const { chartJs } = require('../../modules/canvas.js');

exports.run = async (client, message, args) => {
    let days;
    if (!args[0]) {
        days = 15;
    } else {
        days = parseInt(args[0], 10);
        if (!Number.isSafeInteger(days) || days <= 0 || days > 730) {
            return message.reply('請給予1~730的天數範圍');
        }
    }

    let daysNoNeed;
    if (!args[1]) {
        daysNoNeed = 0;
    } else {
        daysNoNeed = parseInt(args[1], 10);
        if (!Number.isSafeInteger(daysNoNeed) || daysNoNeed <= 0 || daysNoNeed > 730) {
            return message.reply('請給予1~730的天數範圍');
        }
        if (daysNoNeed >= days) {
            return message.reply('請給予小於起始天數範圍');
        }
    }

    const chartRes = await level.aggregate([
        { $unwind: '$daily' },
        {
            $group: {
                _id: '$daily.date',
                total: { $sum: '$daily.count' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const total = chartRes.map((d) => d.total).slice(-days).slice(0, days - daysNoNeed).reduce((ac, val) => ac + val, 0);

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    const conf = {
        type: 'line',
        data: {
            labels: chartRes.map((d) => `${new Date((d._id) * 86400000).getMonth() + 1}/${new Date((d._id) * 86400000).getDate()}(${weekDays[new Date((d._id) * 86400000).getDay()]})`).slice(-days).slice(0, days - daysNoNeed),
            datasets: [{
                label: '訊息量',
                fill: false,
                borderColor: '#ffae00',
                pointRadius: 0,
                data: chartRes.map((d) => d.total).slice(-days).slice(0, days - daysNoNeed),
            }],
        },
        options: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: '伺服器訊息資料圖表',
            },
            devicePixelRatio: 5,
        },
    };

    const imageGen = new MessageAttachment(await chartJs.renderToBuffer(conf), 'server_chart.png');

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle(daysNoNeed > 0 ? `${days}天內訊息量資料圖表(去除最近${daysNoNeed}天)` : `${days}天內訊息量資料圖表`)
        .setDescription(`總和：\`${total}\` 則\n平均：\`${Math.round((total / (days - daysNoNeed)) * 100) / 100}\` 則/天`)
        .setImage('attachment://server_chart.png');

    message.reply({ embeds: [exampleEmbed], files: [imageGen] });
};

exports.conf = {
    aliases: ['shortmsgc', 'shortmsgg', 'shortmsggraph', 'smc', 'smg', 'shortmessagechart', 'shortmessagegraph'],
    permLevel: 'User',
    description: '總訊息量排行榜',
};
