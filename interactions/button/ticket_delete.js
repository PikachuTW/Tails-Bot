const ticket = require('../../models/ticket.js');

module.exports = async (client, interaction) => {
    await ticket.deleteOne({ channelid: interaction.channel.id });
    interaction.channel.delete();
};
