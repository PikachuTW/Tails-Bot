const ticket = require('../models/ticket.js');
const misc = require('../models/misc.js');
const cooldown = require('../models/cooldown.js');
const { Permissions, MessageActionRow, MessageButton } = require('discord.js');


module.exports = async (client, interaction) => {
    if (interaction.guildId !== '828450904990154802') return;
    if (interaction.isButton()) {

        let data = await cooldown.findOne({ discordid: interaction.member.id });
        if (!data) {
            data = await cooldown.create({
                discordid: interaction.member.id,
                buttonstamp: 0,
            });
        }

        if (Date.now() - data.buttonstamp < 10000 && interaction.member.id != '650604337000742934') {
            return interaction.reply({ content: `按鈕還在冷卻中! (${((10000 - (Date.now() - data.buttonstamp)) / 1000).toPrecision(2)}秒)`, ephemeral: true });
        }

        await cooldown.updateOne({ 'discordid': interaction.member.id }, { $set: { 'buttonstamp': Date.now() } });
        await ticket.deleteMany({ 'channelid': { $nin: interaction.guild.channels.cache.map(channel => channel.id) } });

        if (!interaction.isButton()) return;
        if (interaction.customId == 'ticket_open') {
            const checkTicket = await ticket.findOne({ 'discordid': interaction.member.id });
            const checkTicketOpen = await ticket.findOne({ 'discordid': interaction.member.id, 'closed': false });
            if (checkTicket && checkTicketOpen) {
                interaction.reply({ content: `你的票在 <#${checkTicket.channelid}>`, ephemeral: true });
            }
            else {
                const count = await misc.findOneAndUpdate({ 'key': 'count' }, { $inc: { 'value_num': 1 } });
                const channelCreated = await client.channels.cache.find(channel => channel.id == '905791290539647026').createChannel(`ticket - ${count.value_num + 1}`, {
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
                interaction.reply({ content: `你的新票在 ${channelCreated}`, ephemeral: true });
                channelCreated.send({
                    content: `${interaction.member} 你好，請等候群主為你服務，若有緊急事項，請直接提及群主`, components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('ticket_close')
                                    .setLabel('🔒 關閉票券')
                                    .setStyle('SECONDARY'),
                            )],
                });
            }
        }


        if (interaction.customId == 'ticket_close') {
            const checkTicket = await ticket.findOne({ 'channelid': interaction.channel.id });
            if (!checkTicket || checkTicket.closed == true) {
                interaction.reply('票券早就不存在或已經關閉!');
            }
            else {
                const filter = m => m.author.id == interaction.member.id;
                const collector = interaction.channel.createMessageCollector({ filter, time: 10000 });
                interaction.reply('你是否確定關閉票券? (y/n)');

                let done = false;

                collector.on('collect', async m => {
                    if (['y', 'yes', '是'].indexOf(m.content.toLowerCase()) == -1) return collector.stop();
                    done = true;
                    collector.stop();
                    await ticket.updateOne({ 'channelid': interaction.channel.id }, { $set: { 'closed': true } });
                    interaction.channel.permissionOverwrites.edit(checkTicket.discordid, { VIEW_CHANNEL: false });
                    interaction.reply('已經關閉!');
                    interaction.channel.send({
                        content: '已經關閉票券!', components: [
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
                    if (done == true) return;
                    return interaction.channel.send('已經取消!');
                });
            }
        }


        if (interaction.customId == 'ticket_reopen') {
            const checkTicket = await ticket.findOne({ 'channelid': interaction.channel.id });
            if (!checkTicket || checkTicket.closed == false) {
                interaction.reply('票券早就不存在或未關閉!');
            }
            else {
                await ticket.updateOne({ 'channelid': interaction.channel.id }, { $set: { 'closed': false } });
                interaction.channel.permissionOverwrites.edit(checkTicket.discordid, { VIEW_CHANNEL: true });
                interaction.reply('已經重新開啟票券!');
                interaction.channel.send({
                    content: `<@${checkTicket.discordid}> 你的票券已經重新開啟!`, components: [
                        new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('ticket_close')
                                    .setLabel('🔒 關閉票券')
                                    .setStyle('PRIMARY'),
                            )],
                });
            }
        }

        if (interaction.customId == 'ticket_delete') {
            await ticket.deleteOne({ 'channelid': interaction.channel.id });
            interaction.channel.delete();
        }

    }
    else if (interaction.isSelectMenu()) {

        let data = await cooldown.findOne({ discordid: interaction.member.id });
        if (!data) {
            data = await cooldown.create({
                discordid: interaction.member.id,
                selectstamp: 0,
            });
        }

        if (Date.now() - data.selectstamp < 2000) {
            return interaction.reply({ content: `選項還在冷卻中! (${((2000 - (Date.now() - data.selectstamp)) / 1000).toPrecision(2)}秒)`, ephemeral: true });
        }

        await cooldown.updateOne({ 'discordid': interaction.member.id }, { $set: { 'selectstamp': Date.now() } });

        if (interaction.customId == 'countryRole') {
            if (interaction.values[0] != 'clear') {
                await interaction.member.roles.add(interaction.values[0]);
                await interaction.reply({ content: `你已經獲得 ${interaction.guild.roles.cache.find(role => role.id == interaction.values[0])}`, ephemeral: true });
            }
            else {
                await interaction.member.roles.remove(['856410483120799744', '856410560622362633', '856410586879229982', '856410631494565928', '856412324676108289']);
                await interaction.reply({ content: '你已經清除所有國家/地區身分組', ephemeral: true });
            }
        }
        else if (interaction.customId == 'sexRole') {
            if (interaction.values[0] != 'clear') {
                await interaction.member.roles.add(interaction.values[0]);
                await interaction.reply({ content: `你已經獲得 ${interaction.guild.roles.cache.find(role => role.id == interaction.values[0])}`, ephemeral: true });
            }
            else {
                await interaction.member.roles.remove(['874567548098736129', '874567579539222568', '874567832317354034', '874567837165953074', '874568093542805534']);
                await interaction.reply({ content: '你已經清除所有性別身分組', ephemeral: true });
            }
        }
        else if (interaction.customId == 'annRole') {
            if (interaction.values[0] != 'clear') {
                await interaction.member.roles.add(interaction.values[0]);
                await interaction.reply({ content: `你已經獲得 ${interaction.guild.roles.cache.find(role => role.id == interaction.values[0])}`, ephemeral: true });
            }
            else {
                await interaction.member.roles.remove(['857621232282238986', '892235277823799367']);
                await interaction.reply({ content: '你已經清除所有通知身分組', ephemeral: true });
            }
        }
        else if (interaction.customId == 'nsfw') {
            if (interaction.values[0] == 'remove') {
                await interaction.reply({ content: '你已經移除 <@&943152949511729193>', ephemeral: true });
                interaction.member.roles.remove('943152949511729193');
            }
            else {
                await interaction.reply({ content: '你已經獲得 <@&943152949511729193>', ephemeral: true });
                interaction.member.roles.add('943152949511729193');
            }
        }
    }
};