module.exports = (client, member) => {

    member.guild.channels.cache.find(channel => channel.id === '833282316591300619').send(`**${member.user.tag} 離開了**`);
};