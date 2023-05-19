/* eslint-disable no-underscore-dangle */
const { MessageEmbed, MessageAttachment } = require('discord.js');
const level = require('../../models/level.js');
const { chartJs } = require('../../modules/canvas.js');

exports.run = async (client, message) => {
    const res = await level.aggregate([
        { $unwind: '$daily' },
        {
            $group: {
                _id: '$discordid',
                total: { $sum: '$daily.count' },
            },
        },
        { $sort: { total: -1 } },
        { $limit: 10 },
    ]);

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

    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    const conf = {
        type: 'line',
        data: {
            labels: chartRes.map((d) => `${new Date((d._id) * 86400000).getMonth() + 1}/${new Date((d._id) * 86400000).getDate()}(${weekDays[new Date((d._id) * 86400000).getDay()]})`),
            datasets: [{
                label: '訊息量',
                fill: false,
                borderColor: '#ffae00',
                pointRadius: 0,
                data: chartRes.map((d) => d.total),
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

    let co = '';

    for (let i = 0; i < 10; i++) {
        co += `\`${i + 1}\` <@${res[i]._id}> **${res[i].total}**\n`;
    }

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle('總訊息量前十排行榜')
        .setDescription(co)
        .setImage('attachment://server_chart.png');

    message.reply({ embeds: [exampleEmbed], files: [imageGen] });
};

exports.conf = {
    aliases: ['msglb'],
    permLevel: 'User',
    description: '總訊息量排行榜',
};
