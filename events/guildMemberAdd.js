module.exports = (client, member) => {
    if (member.guild.id !== '828450904990154802') return;
    const hasRole = member.roles.cache.has('864379903164284940') || false;
    try {
        if (!hasRole) {
            member.roles.add('864379903164284940');
        }
    } catch { }
    try {
        member.send(`${member} 歡迎來到${member.guild.name}，請好好閱讀規則後，盡情享受聊天討論!\n\n群組永久連結: https://discord.gg/HswZaneNjQ`);
    } catch { }
    try {
        client.channels.cache.get('948178858610405426').send(`${member} **歡迎來到伺服器!! Welcome to the server!!**`);
    } catch {}
};
