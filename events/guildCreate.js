module.exports = (client, guild) => {
  if (['828450904990154802', '901030595294035998'].indexOf(guild.id) == -1) {
    guild.leave();
  }
};
