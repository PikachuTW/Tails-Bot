const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle(`${message.author.username} 的每日任務列表`)
                .setDescription(
                    `發送300則訊息 \`中等\`\n獎勵：20 tails shards\n\n領tails幣40次 \`困難\`\n獎勵：50 tails shards${''}`,
                ),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '增加你的Tails幣餘額',
};
