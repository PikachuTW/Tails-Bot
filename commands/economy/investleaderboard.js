const { MessageAttachment } = require('discord.js');
const economyModel = require('../../models/economy.js');
const { Canvas } = require('../../modules/canvas.js');

exports.run = async (client, message) => {
    let res = await economyModel.find({}).sort({ level: -1 }).limit(11);

    res = res.filter((k) => k.discordid !== '650604337000742934');

    const top10 = res.slice(0, 10);
    const leaderboard = top10.map(({ discordid, level }, index) => ({
        0: `${index + 1}`, 1: client.users.cache.get(discordid)?.username || 'Unknown', 4: `${level}`, 6: `${Math.round(level ** 1.225) + 1}`,
    }));

    const canvaWidth = 3500;
    const canvaHeight = 2500;
    const tableX = 20;
    const tableY = 20;
    const tableWidth = canvaWidth - tableX * 2;
    const tableHeight = canvaHeight - tableY * 2;
    const rows = 11;
    const cols = 8;
    const cellWidth = tableWidth / cols;
    const cellHeight = tableHeight / rows;

    const canvas = Canvas.createCanvas(canvaWidth, canvaHeight);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#36393F';
    ctx.fillRect(tableX, tableY, tableWidth, tableHeight);
    ctx.strokeStyle = '#EEEEEE';
    ctx.lineWidth = 20;
    ctx.strokeRect(tableX, tableY, tableWidth, tableHeight);

    for (let i = 1; i < cols; i++) {
        if ([1, 4, 6].includes(i)) {
            const x = tableX + i * cellWidth;
            ctx.beginPath();
            ctx.moveTo(x, tableY);
            ctx.lineTo(x, tableY + tableHeight);
            ctx.stroke();
        }
    }

    for (let i = 1; i < rows; i++) {
        const y = tableY + i * cellHeight;
        ctx.beginPath();
        ctx.moveTo(tableX, y);
        ctx.lineTo(tableX + tableWidth, y);
        ctx.stroke();
    }

    ctx.fillStyle = '#EEEEEE';
    ctx.font = `175px ${Canvas.font}`;
    ctx.textBaseline = 'middle';
    const table = [{
        0: '排名', 1: '名稱', 4: '投資等級', 6: '出資金額',
    }, ...leaderboard];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const element = table[i][j];
            if (element) {
                const x = tableX + j * cellWidth;
                const y = tableY + i * cellHeight;
                ctx.fillText(element, x + cellWidth / 10, y + cellHeight / 2);
            }
        }
    }

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${message.member.id}_mission.png`);

    message.reply({ files: [attachment] });
};

exports.conf = {
    aliases: ['ivlb'],
    permLevel: 'User',
    description: 'Tails幣排行榜',
};
