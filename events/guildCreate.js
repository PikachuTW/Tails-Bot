module.exports = async (client, guild) => {
    if (!['828450904990154802', '901030595294035998'].includes(guild.id)) {
        await guild.leave();
    }
};
