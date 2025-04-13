exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply('請給予ID');
    try {
        const res = await message.guild.bans.fetch(args[0]);
        message.reply({
            content: `\`\`\`Banned, reason: ${res.reason}\`\`\``,
            allowedMentions: { parse: ['users'] },
        });
    } catch (e) {
        message.reply('未被ban');
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'Owner',
    description: '查詢被ban與否及原因',
};
