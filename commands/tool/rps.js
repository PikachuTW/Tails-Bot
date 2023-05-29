const { MessageActionRow, MessageButton } = require('discord.js');
const { targetGet } = require('../../modules/functions');

exports.run = async (client, message, args) => {
    const opponent = targetGet(message, args);

    if (!opponent) {
        return message.reply('請提供一個有效的對手');
    }

    if (opponent.user.bot) {
        return message.reply('機器人不能玩這個遊戲');
    }

    if (opponent.id === message.author.id) {
        return message.reply('你不能和自己玩這個遊戲');
    }

    const row1 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('yes')
                .setLabel('是')
                .setStyle('SUCCESS')
                .setDisabled(false),
            new MessageButton()
                .setCustomId('no')
                .setLabel('否')
                .setStyle('DANGER')
                .setDisabled(false),
        );

    const gameMessage = await message.channel.send({ content: `${opponent}, 你想玩石頭、剪刀、布嗎？`, components: [row1] });

    const filter1 = (interaction) => interaction.user.id === opponent.id && interaction.isButton();
    const collector1 = gameMessage.createMessageComponentCollector({ filter: filter1, time: 15000 });

    collector1.on('collect', async (interaction) => {
        await interaction.reply({ content: '你已經加入遊戲', ephemeral: true });
        collector1.stop();
        if (interaction.customId === 'yes') {
            const row2 = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rock')
                        .setEmoji('✊')
                        .setStyle('SUCCESS')
                        .setDisabled(false),
                    new MessageButton()
                        .setCustomId('paper')
                        .setEmoji('✋')
                        .setStyle('SUCCESS')
                        .setDisabled(false),
                    new MessageButton()
                        .setCustomId('scissors')
                        .setEmoji('✌️')
                        .setStyle('SUCCESS')
                        .setDisabled(false),
                );

            await gameMessage.edit({ content: `${opponent}, 請選擇你的出拳`, components: [row2] });

            const filter2 = (interaction2) => interaction2.user.id === opponent.id && interaction2.isButton();
            const collector2 = gameMessage.createMessageComponentCollector({ filter: filter2, time: 15000 });

            collector2.on('collect', async (interaction2) => {
                await interaction2.reply({ content: `你已經出了 ${interaction2.customId}`, ephemeral: true });
                collector2.stop();
                const opponentChoice = interaction2.customId;
                gameMessage.edit({ content: `${message.member}，換你出了` });

                const filter3 = (interaction3) => interaction3.user.id === message.member.id && interaction2.isButton();
                const collector3 = gameMessage.createMessageComponentCollector({ filter: filter3, time: 15000 });

                collector3.on('collect', async (interaction3) => {
                    await interaction3.reply({ content: `你已經出了 ${interaction3.customId}`, ephemeral: true });
                    collector3.stop();
                    const authorChoice = interaction3.customId;
                    let result;

                    if (opponentChoice === authorChoice) {
                        result = '平手！';
                    } else if ((opponentChoice === 'rock' && authorChoice === 'scissors')
                        || (opponentChoice === 'paper' && authorChoice === 'rock')
                        || (opponentChoice === 'scissors' && authorChoice === 'paper')) {
                        result = `${opponent} 贏了！`;
                    } else {
                        result = `${message.member} 贏了！`;
                    }

                    await gameMessage.edit({ content: `# ${opponent} 出了 ${opponentChoice}\n# ${message.member} 出了 ${authorChoice}\n# ${result}`, components: [] });
                    collector2.stop();
                });

                collector3.on('end', async (collected3) => {
                    if (collected3.size === 0) {
                        await gameMessage.edit({ content: `${message.member} 沒有回應，${message.member}輸了` });
                        row2.components.forEach((component) => component.setDisabled(true));
                        await gameMessage.edit({ components: [row2] });
                    }
                });
            });

            collector2.on('end', async (collected) => {
                if (collected.size === 0) {
                    row2.components.forEach((component) => component.setDisabled(true));
                    await gameMessage.edit({ content: `${opponent} 沒有回應，${opponent}輸了`, components: [row2] });
                    row2.components.forEach((component) => component.setDisabled(true));
                }
            });
        } else {
            await interaction.update({ content: `${opponent} 拒絕了你的挑戰` });
        }
    });

    collector1.on('end', async (collected) => {
        if (collected.size === 0) {
            row1.components.forEach((component) => component.setDisabled(true));
            await gameMessage.edit({ content: `${opponent} 沒有回應，他拒絕了你的挑戰`, components: [row1] });
        }
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '剪刀、石頭、布',
};
