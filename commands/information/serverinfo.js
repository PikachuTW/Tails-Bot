const { MessageEmbed } = require('discord.js');

exports.run = async (client, message) => {
    const Guild = message.guild;
    const tier = Guild.premiumTier;
    let banCount = await Guild.bans.fetch();
    banCount = banCount.size;
    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle(Guild.name)
                .setColor('#ffae00')
                .setDescription(
                    `**ID:** \`${Guild.id}\`
                    **Owner:** <@${Guild.ownerId}>
                    **創建時間:** <t:${Math.round(Guild.createdTimestamp / 1000)}>
                    **人數:** \`${Guild.memberCount}\`
                    **加成:** 等級 \`${tier === 'TIER_1' ? 1 : tier === 'TIER_2' ? 2 : tier === 'TIER_3' ? 3 : '無'}\` 加成數 \`${Guild.premiumSubscriptionCount}\`

                    **身分組數:** \`${Guild.roles.cache.size}\`
                    **頻道數:** \`${Guild.channels.channelCountWithoutThreads}\`
                    **表情數:** \`${Guild.emojis.cache.size}\`
                    **封鎖數:** \`${banCount}\``,
                )
                .setThumbnail(Guild.iconURL({ dynamic: true, format: 'png' })),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '伺服器詳細資訊',
};
