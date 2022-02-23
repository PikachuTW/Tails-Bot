const { whitelist } = require('../config.js');
const { leaderCheck } = require('../modules/functions.js');

module.exports = (client, member) => {

    member.guild.channels.cache.find(channel => channel.id === '833282316591300619').send(`**${member.user.tag} 離開了**`);

    if (leaderCheck(member)) {
        const targetguild = client.guilds.cache.find(guild => guild.id === '828450904990154802');
        const user1 = targetguild.members.cache.get('543678628148281355');
        const user3 = targetguild.members.cache.get('342148006482542612');
        user1.roles.remove(user1.roles.cache.filter(r => r.id != '830689873367138304' && r.id != '864379903164284940' && r.id != '872493084502523935'));
        user3.roles.remove(user3.roles.cache.filter(r => r.id != '830689873367138304' && r.id != '864379903164284940') && r.id != '872493084502523935');
        user1.user.send('行政長官離職');
        user3.user.send('行政長官離職');
        client.channels.cache.find(channel => channel.id === '858548163522330665').send('@everyone 由於行政長官離開，高層已經全部進行緊急革職');
    }
};