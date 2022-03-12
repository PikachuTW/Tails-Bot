module.exports = (client, member) => {
    if (member.guild.id != '828450904990154802') return;
    try {
        member.roles.add('864379903164284940');
    }
    catch { }
    try {
        member.send(`${member} 歡迎來到林天天，請好好閱讀規則後，盡情享受聊天討論!\n\n群組永久連結: https://discord.gg/HswZaneNjQ`);
    }
    catch { }
};