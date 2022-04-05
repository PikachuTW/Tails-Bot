const { MessageActionRow, MessageButton } = require('discord.js');
const ticket = require('../../models/ticket.js');

module.exports = async (client, interaction) => {
    const checkTicket = await ticket.findOne({ channelid: interaction.channel.id });
    if (!checkTicket || checkTicket.closed === false) {
        interaction.reply('票券早就不存在或未關閉!');
    } else {
        await ticket.updateOne({ channelid: interaction.channel.id }, { $set: { closed: false } });
        interaction.channel.permissionOverwrites.edit(checkTicket.discordid, { VIEW_CHANNEL: true });
        interaction.reply('已經重新開啟票券!');
        interaction.channel.send({
            content: `<@${checkTicket.discordid}> 你的票券已經重新開啟!`,
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ticket_close')
                            .setLabel('🔒 關閉票券')
                            .setStyle('PRIMARY'),
                    )],
        });
    }
};
