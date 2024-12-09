module.exports = (client, member) => {
    let snipesender = member.user.tag;
    const [name, tagNumber] = snipesender.split('#');
    if (tagNumber === '0') {
        snipesender = name;
    }
    member.guild.channels.cache.get('833282316591300619').send(`**${snipesender} (${member.id}) 離開了**`);
    member.guild.channels.cache.get('948178858610405426').send(`**${snipesender} 離開了**`);
};
