exports.run = async (client, message, args) => {
    const target = message.mentions.members.first() || message.guild.members.cache.find(member => member.id === args[0]);
    if (!target) return message.reply('請給予有效目標!');
    const nickname = args.slice(1).join(' ');
    if (!nickname) return message.reply('請提供暱稱!');
    if (message.member.roles.highest.comparePositionTo(target.roles.highest) <= 0 && target.id != message.member.id) return message.reply('你身分組並沒有比他高 :weary:');

    if (nickname == 'null') {
        target.setNickname(null);
        return message.reply(`${target} 的暱稱已經重置!!`);
    }

    try {
        target.setNickname(nickname, `${message.author.tag}`);
    }
    catch {
        return message.reply('暱稱過長!');
    }

    message.reply(`${target} 的暱稱已經修改成 ${nickname}`);
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['nick'],
    permLevel: 'Admin',
};

exports.help = {
    name: 'nickname',
    category: '管理',
    description: '更改暱稱',
    usage: 'nickname <@成員>',
};