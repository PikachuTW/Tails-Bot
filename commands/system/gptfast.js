const { MessageEmbed } = require('discord.js');
const { Routes } = require('discord-api-types/v10');

exports.run = async (client, message, args) => {
    if (!client.gptReady) return message.reply('Chatgpt尚未啟動完畢');
    const stamp = client.container.gptCooldown.get(message.member.id) || 0;
    const now = Date.now();
    if (now - stamp < 4000 && message.member.id !== '650604337000742934') {
        try {
            await message.reply(`冷卻中! (${((4000 - (now - stamp)) / 1000).toPrecision(2)}秒)`);
            return;
        } catch { }
    }
    client.container.gptCooldown.set(message.member.id, now);

    const msg = await message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(
                    '```機器人正在進行思考...```',
                ),
        ],
    });

    const api = client.GPT;
    let previousId = client.container.gptDataBase.get(message.member.id);
    if (!previousId)previousId = null;
    const res = await api.sendMessage(args.slice(0).join(' '), {
        parentMessageId: previousId,
    });
    console.log(res);
    client.container.gptDataBase.set(message.member.id, res.id);
    try {
        await client.container.rest.delete(Routes.channelMessage(msg.channel.id, msg.id));
    } catch {}
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setDescription(
                    `\`\`\`${res.text}\`\`\``,
                ),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '',
};
