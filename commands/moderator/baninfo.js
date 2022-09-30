exports.run = async (client, message, args) => {
    const res = await message.guild.bans.fetch(args[0]);
    message.reply({ content: `Banned, reason: ${res.reason}`, allowedMentions: { parse: ['users'] } });
};

exports.conf = {
    aliases: [],
    permLevel: 'Owner',
    description: '查詢被ban與否及原因',
};
