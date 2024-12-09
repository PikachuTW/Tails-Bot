exports.run = async (client, message) => {
    const cooldown = client.container.reportcd.get(message.author.id);
    const cd = 60000;
    if (cooldown && (Date.now() - cooldown < cd)) {
        const remainingTime = Math.round(((cd - Date.now() + cooldown) / 1000));
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeLeft = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
        return message.reply(`你還要再${timeLeft}才能使用!`);
    }
    client.container.reportcd.set(message.author.id, Date.now());
    message.channel.send('<@&832213672695693312> 有人通知你處理事件');
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '檢舉訊息，通知管理員',
};
