module.exports = async (client, thread) => {
    thread.join();
    const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite', 't.me', 'lamtintinfree'];

    if (bannedWords.some((word) => thread.name.toLowerCase().includes(word)) && ['650604337000742934', '889358372170792970'].indexOf(thread.ownerId) === -1) {
        await thread.delete();
        const m = thread.guild.members.cache.get(thread.ownerId);
        m.send(`:x: ${m} 你不允許發送邀請連結!!`);
    }
};
