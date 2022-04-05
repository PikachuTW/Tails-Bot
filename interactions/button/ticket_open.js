const { Permissions, MessageActionRow, MessageButton } = require('discord.js');
const ticket = require('../../models/ticket.js');
const misc = require('../../models/misc.js');

module.exports = async (client, interaction) => {
    const checkTicket = await ticket.findOne({ discordid: interaction.member.id });
    const checkTicketOpen = await ticket.findOne({ discordid: interaction.member.id, closed: false });
    if (checkTicket && checkTicketOpen) {
        interaction.reply({ content: `你的票在 <#${checkTicket.channelid}>`, ephemeral: true });
    } else {
        const count = await misc.findOneAndUpdate({ key: 'count' }, { $inc: { value_num: 1 } });
        const channelCreated = await client.channels.cache.find((channel) => channel.id === '905791290539647026').createChannel(`ticket - ${count.value_num + 1}`, {
            permissionOverwrites: [
                {
                    id: '828450904990154802',
                    deny: [Permissions.FLAGS.VIEW_CHANNEL],
                },
                {
                    id: interaction.member.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
                },
            ],
        });
        await ticket.create({
            discordid: interaction.member.id,
            channelid: channelCreated.id,
            closed: false,
        });
        await interaction.reply({ content: `你的新票在 ${channelCreated}`, ephemeral: true });
        channelCreated.send({
            content: `${interaction.member} 你好，請等候群主為你服務，若有緊急事項，請直接提及群主`,
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ticket_close')
                            .setLabel('🔒 關閉票券')
                            .setStyle('SECONDARY'),
                    )],
        });
    }
};
