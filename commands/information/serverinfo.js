const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    const { guild } = message;
    const tier = guild.premiumTier;
    let banCount = await guild.bans.fetch();
    banCount = banCount.size;
    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle(guild.name)
                .setColor('#ffae00')
                .setDescription(
                    `**ID:** \`${guild.id}\`
                    **Owner:** <@${guild.ownerId}>
                    **創建時間:** <t:${Math.round(guild.createdTimestamp / 1000)}>
                    **人數:** \`${guild.memberCount}\`
                    **加成:** 等級 \`${tier === 'TIER_1' ? 1 : tier === 'TIER_2' ? 2 : tier === 'TIER_3' ? 3 : '無'}\` 加成數 \`${guild.premiumSubscriptionCount}\`

                    **身分組數:** \`${guild.roles.cache.size}\`
                    **頻道數:** \`${guild.channels.channelCountWithoutThreads}\`
                    **表情數:** \`${guild.emojis.cache.size}\`
                    **封鎖數:** \`${banCount}\``,
                )
                .setThumbnail(guild.iconURL({ dynamic: true, format: 'png' })),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '伺服器詳細資訊',
};
