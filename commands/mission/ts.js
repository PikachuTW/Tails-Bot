const { MessageAttachment } = require('discord.js');
const { Canvas } = require('../../modules/canvas.js');

exports.run = async (client, message) => {
    const canvaWidth = 3000;
    const canvaHeight = 2500;
    const tableX = 20;
    const tableY = 20;
    const tableWidth = canvaWidth - tableX * 2;
    const tableHeight = canvaHeight - tableY * 2;
    const rows = 11;
    const cols = 6;
    const cellWidth = tableWidth / cols;
    const cellHeight = tableHeight / rows;

    const canvas = Canvas.createCanvas(canvaWidth, canvaHeight);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(tableX, tableY, tableWidth, tableHeight);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 20;
    ctx.strokeRect(tableX, tableY, tableWidth, tableHeight);

    for (let i = 1; i < cols; i++) {
        if ([1, 4].includes(i)) {
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

    ctx.fillStyle = '#000000';
    ctx.font = `180px ${Canvas.font}`;
    ctx.textBaseline = 'middle';
    // 繪製表格的內容
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = tableX + j * cellWidth;
            const y = tableY + i * cellHeight;
            ctx.fillText(`(${i}, ${j})`, x + cellWidth / 10, y + cellHeight / 2);
        }
    }

    const attachment = new MessageAttachment(canvas.toBuffer('image/png'), `${message.member.id}_mission.png`);

    message.reply({ files: [attachment] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '你好',
};
