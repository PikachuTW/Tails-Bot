/* eslint-disable no-param-reassign */
const logger = require('../modules/Logger.js');
const { permlevel } = require('../modules/functions.js');
const { settings: { prefix }, permLevels } = require('../config.js');
const levelModel = require('../models/level.js');
const afkModel = require('../models/afk.js');
const imageSaveMap = require('../imageSaveMap.js');

const CONFIG = {
    GUILD_ID: '828450904990154802',
    COMMAND_COOLDOWN: 1000,
    OWNER_ID: '650604337000742934',
    IMAGE_CHANNEL_ID: '1269552850887901204',
    ADMIN_IDS: ['650604337000742934', '962270937665896478', '889358372170792970'],
    MASS_PING_THRESHOLD: 5,
    TIMEOUT_DURATION: 30000,
    LEVEL_CHANNEL_IDS: ['948178858610405426', '1144935378437017662', '1255973701665685617'],
    MESSAGE_COOLDOWN: 750,
    TIMEZONE_OFFSET: 28800000,
    DAYS_IN_MS: 86400000,

    TOTAL_MESSAGE_ROLES: [
        { count: 4, roleId: '1201814055426473984' },
        { count: 39, roleId: '1201815869974650901' },
        { count: 99, roleId: '1201815771190399016' },
        { count: 249, roleId: '1201815676033966130' },
        { count: 499, roleId: '1201815604944707594' },
        { count: 999, roleId: '1201815541602603018' },
        { count: 1999, roleId: '1201815472505630720' },
        { count: 4999, roleId: '1201815306159534120' },
        { count: 9999, roleId: '1201815249628704768' },
        { count: 19999, roleId: '1201815168573505567' },
        { count: 29999, roleId: '1201815103423643698' },
        { count: 39999, roleId: '1201814971818979348' },
        { count: 49999, roleId: '1201814860757999638' },
        { count: 59999, roleId: '1201814747436032041' },
        { count: 74999, roleId: '1201814654041456670' },
        { count: 99999, roleId: '1201814547405750342' },
        { count: 124999, roleId: '1201814374168408114' },
        { count: 149999, roleId: '1201814291465117747' },
    ],

    ACTIVE_ROLES: [
        { count: 59, roleId: '856808847251734559' },
        { count: 149, roleId: '1014857925107392522' },
        { count: 149, roleId: '861459068789850172' },
    ],

    SPECIAL_ROLE_ID: '861459068789850172',
};

const handleCommand = async (client, message) => {
    if (message.author.bot || !message.content.toLowerCase().startsWith(prefix)) return null;

    const { container } = client;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const userPermLevel = permlevel(message.member);
    const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));

    if (!cmd) return null;

    const requiredPermLevel = container.levelCache[cmd.conf.permLevel] ?? Infinity;

    if (userPermLevel < requiredPermLevel) {
        try {
            await message.reply(`你沒有權限使用!\n你的權限等級為 ${userPermLevel} (${permLevels.find((l) => l.level === userPermLevel).name})\n你需要權限等級 ${requiredPermLevel} (${cmd.conf.permLevel})`);
        } catch (err) {
            logger.error(`Failed to send no perm\n${err}`);
        }
        return null;
    }

    try {
        const stamp = client.container.cooldown.get(message.author.id) || 0;
        const now = Date.now();

        if (now - stamp < CONFIG.COMMAND_COOLDOWN && message.author.id !== CONFIG.OWNER_ID) {
            try {
                message.reply(`指令還在冷卻中! (${((1000 - (now - stamp)) / 1000).toPrecision(2)}秒)`);
            } catch (err) {
                logger.error(`Failed to send cooldown\n${err}`);
            }
            return null;
        }

        message.author.newName = message.author.discriminator === '0'
            ? message.author.username
            : message.author.tag;

        if (message.member) {
            message.member.user.newName = message.author.newName;
        }

        await cmd.run(client, message, args);
        client.container.cooldown.set(message.author.id, now);
        logger.cmd(`${permLevels.find((l) => l.level === userPermLevel).name} ${message.author.newName} 執行了 ${cmd.conf.name}`);
        return cmd.conf.name;
    } catch (e) {
        try {
            message.channel.send({ content: `出現了些錯誤\n\`\`\`${e.message}\`\`\``.slice(0, 2000) });
        } catch (err) {
            logger.error(`Failed to send error message\n${err}`);
        }
        logger.error(`Command can't be excuted\n${e}`);
        return null;
    }
};

const saveAttachments = async (client, message) => {
    if (!message.attachments || message.attachments.size === 0) return;

    try {
        const imageChannel = client.channels.cache.get(CONFIG.IMAGE_CHANNEL_ID);
        if (!imageChannel) {
            logger.error(`Image channel ${CONFIG.IMAGE_CHANNEL_ID} not found`);
            return;
        }

        const imageMessage = await imageChannel.send({
            content: `By ${message.author} in ${message.channel}`,
            files: Array.from(message.attachments.values()).map((a) => ({ attachment: a.url })),
            allowedMentions: { parse: [] },
        });

        const attachmentsArray = Array.from(message.attachments.values());
        imageMessage.attachments.forEach((newAttachment, i) => {
            if (i < attachmentsArray.length) {
                imageSaveMap.set(attachmentsArray[i].url, newAttachment.url);
            }
        });
    } catch (error) {
        logger.error(`Failed to save attachments\n${error}`);
    }
};

const checkMassMentions = async (message) => {
    if (!message.member || CONFIG.ADMIN_IDS.includes(message.member.id) || message.mentions.users.size < CONFIG.MASS_PING_THRESHOLD) return;

    try {
        await message.member.timeout(CONFIG.TIMEOUT_DURATION, 'mass ping');
        await message.channel.send(`:x: ${message.author} 你不允許大量提及用戶!!`);
    } catch (error) {
        logger.error(`Failed to timeout user for mass mention\n${error}`);
    }
};

const checkBotMention = async (client, message) => {
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        try {
            await message.reply(`嗨! 機器人的前綴是 \`${prefix}\``);
        } catch (error) {
            logger.error(`Failed to respond to bot mention\n${error}`);
        }
    }
};

const handleLevelAndRoles = async (client, message) => {
    if (!message.member || !CONFIG.LEVEL_CHANNEL_IDS.includes(message.channel.id) || message.content.toLowerCase().startsWith('s?')) return;

    try {
        const stamp = client.container.msgCooldown.get(message.author.id);
        const nowMS = Date.now();

        if (stamp && nowMS - stamp < CONFIG.MESSAGE_COOLDOWN) return;

        client.container.msgCooldown.set(message.author.id, nowMS);
        const nowStamp = Math.floor((nowMS + CONFIG.TIMEZONE_OFFSET) / CONFIG.DAYS_IN_MS);

        const levelData = await levelModel.findOneAndUpdate(
            { discordid: message.author.id },
            { $setOnInsert: { daily: [] } },
            { upsert: true, new: true },
        );

        const dailyRecord = levelData.daily.find((d) => d.date === nowStamp);
        if (!dailyRecord) {
            await levelModel.updateOne(
                { discordid: message.author.id },
                { $push: { daily: { date: nowStamp, count: 1 } } },
            );
        } else {
            await levelModel.updateOne(
                { discordid: message.author.id, 'daily.date': nowStamp },
                { $inc: { 'daily.$.count': 1 } },
            );
        }

        const total = levelData.daily.reduce((sum, d) => sum + d.count, 0);
        const active = levelData.daily
            .filter((d) => d.date >= nowStamp - 2)
            .reduce((sum, d) => sum + d.count, 0);
        const sActive = levelData.daily
            .filter((d) => d.date >= nowStamp - 1)
            .reduce((sum, d) => sum + d.count, 0);

        await Promise.all(CONFIG.ACTIVE_ROLES.map(async ({ count, roleId }) => {
            const meetsRequirement = roleId === CONFIG.SPECIAL_ROLE_ID
                ? sActive >= count
                : active >= count;

            if (meetsRequirement && !message.member.roles.cache.has(roleId)) {
                try {
                    await message.member.roles.add(roleId);
                    await message.channel.send({
                        content: `${message.member} 已經獲得 <@&${roleId}>`,
                        allowedMentions: { parse: ['users'] },
                    });
                } catch (error) {
                    logger.error(`Failed to add role ${roleId} to ${message.member.id}\n${error}`);
                }
            }
        }));

        let highestRole = null;
        let highestIndex = -1;

        for (let i = CONFIG.TOTAL_MESSAGE_ROLES.length - 1; i >= 0; i--) {
            if (total >= CONFIG.TOTAL_MESSAGE_ROLES[i].count) {
                highestRole = CONFIG.TOTAL_MESSAGE_ROLES[i];
                highestIndex = i;
                break;
            }
        }

        if (highestRole) {
            const rolesToRemove = CONFIG.TOTAL_MESSAGE_ROLES
                .filter((r) => r.roleId !== highestRole.roleId)
                .map((r) => r.roleId);

            const needsHighestRole = !message.member.roles.cache.has(highestRole.roleId);

            try {
                await message.member.roles.remove(rolesToRemove);

                if (needsHighestRole) {
                    await message.member.roles.add(highestRole.roleId);

                    const isMaxLevel = highestIndex === CONFIG.TOTAL_MESSAGE_ROLES.length - 1;
                    if (isMaxLevel) {
                        await message.reply({
                            content: `${message.member} 已經獲得 <@&${highestRole.roleId}>`,
                            allowedMentions: { parse: ['users'] },
                        });
                    } else {
                        const nextRole = CONFIG.TOTAL_MESSAGE_ROLES[highestIndex + 1];
                        await message.reply({
                            content: `${message.member} 已經獲得 <@&${highestRole.roleId}>，下一個身份組在${nextRole.count + 1}訊息量，可以用t!rank查詢你的總訊息量，努力聊天來升級吧!`,
                            allowedMentions: { parse: ['users'] },
                        });
                    }
                }
            } catch (error) {
                logger.error(`Failed to update roles for ${message.member.id}\n${error}`);
            }
        }
    } catch (error) {
        logger.error(`Error in handleLevelAndRoles for ${message.author.id}\n${error}`);
    }
};

const handleAfkStatus = async (message, executedCommand) => {
    try {
        if (executedCommand !== 'afk') {
            const userAfk = await afkModel.findOne({ discordid: message.author.id });
            if (userAfk) {
                await afkModel.deleteOne({ discordid: message.author.id });
                await message.reply('已經解除你的afk!');
            }
        }

        const mentionedIds = message.mentions.members?.map((m) => m.id) ?? [];
        if (mentionedIds.length === 0) return;

        const afkUsers = await afkModel.find({
            discordid: { $in: mentionedIds },
        });

        if (afkUsers.length === 0) return;

        const firstAfkUser = afkUsers[0];
        await message.channel.send({
            content: `<@${firstAfkUser.discordid}> 正在afk: ${firstAfkUser.content}`,
            allowedMentions: { parse: [] },
        });
    } catch (error) {
        logger.error(`Error in handleAfkStatus\n${error}`);
    }
};

module.exports = async (client, message) => {
    if (message.guildId !== CONFIG.GUILD_ID) return;

    const executedCommand = await handleCommand(client, message);

    if (message.author.bot) return;

    await Promise.all([
        saveAttachments(client, message),
        checkMassMentions(message),
        checkBotMention(client, message),
        handleLevelAndRoles(client, message),
        handleAfkStatus(message, executedCommand),
    ]);
};
