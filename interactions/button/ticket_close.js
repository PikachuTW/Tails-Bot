const { MessageActionRow, MessageButton } = require('discord.js');
const ticket = require('../../models/ticket.js');

module.exports = async (client, interaction) => {
    const checkTicket = await ticket.findOne({ channelid: interaction.channel.id });
    if (!checkTicket || checkTicket.closed === true) {
        interaction.reply('票券早就不存在或已經關閉!');
    } else {
        const filter = (m) => m.author.id === interaction.member.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 10000 });
        interaction.reply('你是否確定關閉票券? (y/n)');

        let done = false;

        collector.on('collect', async (m) => {
            if (['y', 'yes', '是'].indexOf(m.content.toLowerCase()) === -1) return collector.stop();
            done = true;
            collector.stop();
            await ticket.updateOne({ channelid: interaction.channel.id }, { $set: { closed: true } });
            interaction.channel.permissionOverwrites.edit(checkTicket.discordid, { VIEW_CHANNEL: false });
            interaction.reply('已經關閉!');
            interaction.channel.send({
                content: '已經關閉票券!',
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ticket_reopen')
                                .setLabel('🔓 重新開啟票券')
                                .setStyle('SECONDARY'),
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId('ticket_delete')
                                .setLabel('⛔ 刪除票券')
                                .setStyle('SECONDARY'),
                        )],
            });
        });

        collector.on('end', () => {
            if (done === true) return;
            return interaction.channel.send('已經取消!');
        });
    }
};
