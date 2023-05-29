/* eslint-disable no-underscore-dangle */
const { MessageEmbed, MessageAttachment } = require('discord.js');
const level = require('../../models/level.js');
const { chartJs } = require('../../modules/canvas.js');

exports.run = async (client, message, args) => {
    let page;
    if (!args[0]) {
        page = 1;
    } else {
        page = parseInt(args[0], 10);
        if (!Number.isSafeInteger(page) || page <= 0 || page > 100) {
            return message.reply('請給予1~100的頁數範圍');
        }
    }

    const res = await level.aggregate([
        { $unwind: '$daily' },
        {
            $group: {
                _id: '$discordid',
                total: { $sum: '$daily.count' },
            },
        },
        { $sort: { total: -1 } },
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

    let co = '';

    const leftList = {
        '953065839010136124': 'Yoshi Guest',
        '471383299324117015': 'Father Wu',
    };

    for (let i = 10 * page - 10; i < 10 * page; i++) {
        if (Object.keys(leftList).includes(res[i]._id)) {
            co += `\`${i + 1}\` ${leftList[res[i]._id]} **${res[i].total}**\n`;
        } else {
            co += `\`${i + 1}\` <@${res[i]._id}> **${res[i].total}**\n`;
        }
    }

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

    const exampleEmbed = new MessageEmbed()
        .setColor('#ffae00')
        .setTitle((page === 1) ? '總訊息量前十排行榜' : `總訊息量排行榜 第${page}頁`)
        .setDescription(co)
        .setImage('attachment://server_chart.png');

    message.reply({ embeds: [exampleEmbed], files: [imageGen] });
};

exports.conf = {
    aliases: ['msglb'],
    permLevel: 'User',
    description: '總訊息量排行榜',
};
