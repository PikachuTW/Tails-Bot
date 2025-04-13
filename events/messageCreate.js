/* eslint-disable no-param-reassign */
const Discord = require('discord.js');
const logger = require('../modules/Logger.js');
const { permlevel } = require('../modules/functions.js');
const { settings: { prefix }, permLevels } = require('../config.js');
const levelModel = require('../models/level.js');
const afkModel = require('../models/afk.js');
const imageSaveMap = require('../imageSaveMap.js');

const GUILD_ID = '828450904990154802';
const COMMAND_COOLDOWN = 1000;
const OWNER_ID = '650604337000742934';
const IMAGE_CHANNEL_ID = '1269552850887901204';
const ADMIN_IDS = ['650604337000742934', '962270937665896478', '889358372170792970'];
const MASS_PING_THRESHOLD = 5;
const TIMEOUT_DURATION = 30000;
const LEVEL_CHANNEL_IDS = ['948178858610405426', '1144935378437017662', '1255973701665685617'];

const TOTAL_MESSAGE_ROLES = [
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
];

const ACTIVE_ROLES = [
    { count: 59, roleId: '856808847251734559' },
    { count: 149, roleId: '1014857925107392522' },
    { count: 149, roleId: '861459068789850172' },
];

const handleCommand = async (client, message) => {
    if (message.author.bot || !message.content.toLowerCase().startsWith(prefix)) return null;

    const { container } = client;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const userPermLevel = permlevel(message.member);
    const cmd = container.commands.get(command) || container.commands.get(container.aliases.get(command));

    if (!cmd) return null;

    const requiredPermLevel = container.levelCache[cmd.conf.permLevel] === undefined ? Infinity : container.levelCache[cmd.conf.permLevel];

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

        if (now - stamp < COMMAND_COOLDOWN && message.author.id !== OWNER_ID) {
            try {
                message.reply(`指令還在冷卻中! (${((1000 - (now - stamp)) / 1000).toPrecision(2)}秒)`);
            } catch (err) {
                logger.error(`Failed to send cooldown\n${err}`);
            }
            return null;
        }

        if (message.author.discriminator === '0') {
            const newName = message.author.username;
            message.author.newName = newName;
            message.member.user.newName = newName;
        } else {
            message.author.newName = message.author.tag;
            message.member.user.newName = message.author.tag;
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
        const imageChannel = client.channels.cache.get(IMAGE_CHANNEL_ID);
        if (!imageChannel) {
            logger.error(`Image channel ${IMAGE_CHANNEL_ID} not found`);
            return;
        }

        const imageMessage = await imageChannel.send({
            content: `By ${message.author} in ${message.channel}`,
            files: message.attachments.map((a) => new Discord.MessageAttachment(a.url)),
            allowedMentions: { parse: [] },
        });
        let index = 0;
        imageMessage.attachments.each((element) => {
            imageSaveMap.set(message.attachments.at(index).url, element.url);
            index += 1;
        });
    } catch (error) {
        logger.error(`Failed to save attachments\n${error}`);
    }
};

const checkMassMentions = async (message) => {
    if (ADMIN_IDS.includes(message.member.id) || message.mentions.users.size < MASS_PING_THRESHOLD) return;
    try {
        await message.member.timeout(TIMEOUT_DURATION, 'mass ping');
        await message.channel.send(`:x: ${message.author} 你不允許大量提及用戶!!`);
    } catch (error) {
        logger.error(`Failed to timeout user for mass mention\n${error}`);
    }
};

const checkBotMention = async (client, message) => {
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        message.reply(`嗨! 機器人的前綴是 \`${prefix}\``);
    }
};

const handleLevelAndRoles = async (client, message) => {
    if (!LEVEL_CHANNEL_IDS.includes(message.channel.id) || message.content.toLowerCase().startsWith('s?')) return;

    try {
        const levelData = await levelModel.findOneAndUpdate(
            { discordid: message.author.id },
            { $setOnInsert: { daily: [] } },
            { upsert: true, new: true },
        );
        const stamp = client.container.msgCooldown.get(message.author.id);
        const nowMS = Date.now();
        if (!(stamp && nowMS - stamp < 750)) {
            client.container.msgCooldown.set(message.author.id, nowMS);
            const nowStamp = Math.floor((nowMS + 28800000) / 86400000);
            const check = await levelData.daily.find((d) => d.date === nowStamp);
            if (!check) {
                await levelModel.updateOne({ discordid: message.author.id }, { $push: { daily: { date: nowStamp, count: 1 } } });
            } else {
                await levelModel.updateOne({ discordid: message.author.id, 'daily.date': nowStamp }, { $inc: { 'daily.$.count': 1 } });
            }
            const total = levelData.daily.map((d) => d.count).reduce((a, b) => a + b, 0);
            const active = levelData.daily.filter((d) => d.date >= nowStamp - 2).map((d) => d.count).reduce((a, b) => a + b, 0);
            const sActive = levelData.daily.filter((d) => d.date >= nowStamp - 1).map((d) => d.count).reduce((a, b) => a + b, 0);

            ACTIVE_ROLES.forEach(async ({ count, roleId }) => {
                if ((roleId === '861459068789850172' ? sActive >= count : active >= count) && !message.member.roles.cache.has(roleId)) {
                    try {
                        await message.member.roles.add(roleId);
                        await message.channel.send({ content: `${message.member} 已經獲得 <@&${roleId}>`, allowedMentions: { parse: ['users'] } });
                    } catch (error) {
                        logger.error(`Failed to add role ${roleId} to ${message.member.id}\n${error}`);
                    }
                }
            });
            let highestRoleExist = false;
            let highestRole;
            let highestIndex = 0;
            TOTAL_MESSAGE_ROLES.forEach((element, index) => {
                if (total >= element.count) {
                    highestRoleExist = true;
                    highestRole = element;
                    highestIndex = index;
                }
            });
            if (highestRoleExist) {
                const rolesToRemove = TOTAL_MESSAGE_ROLES.filter((r) => r.roleId !== highestRole.roleId).map((r) => r.roleId);

                const needsHighestRole = !message.member.roles.cache.has(highestRole.roleId);

                try {
                    await message.member.roles.remove(rolesToRemove);

                    if (needsHighestRole) {
                        await message.member.roles.add(highestRole.roleId);
                        if (highestIndex >= TOTAL_MESSAGE_ROLES.length - 1) {
                            await message.reply({ content: `${message.member} 已經獲得 <@&${highestRole.roleId}>`, allowedMentions: { parse: ['users'] } });
                        } else {
                            await message.reply({ content: `${message.member} 已經獲得 <@&${highestRole.roleId}>，下一個身份組在${TOTAL_MESSAGE_ROLES[highestIndex + 1].count + 1}訊息量，可以用t!rank查詢你的總訊息量，努力聊天來升級吧!`, allowedMentions: { parse: ['users'] } });
                        }
                    }
                } catch (error) {
                    logger.error(`Failed to update roles for ${message.member.id}\n${error}`);
                }
            }
        }
    } catch (error) {
        logger.error(`Error in handleLevelAndRoles for ${message.author.id}\n${error}`);
    }
};

const handleAfkStatus = async (message, executedCommand) => {
    const afkData = await afkModel.find();
    if (afkData.length === 0) return;
    const afkList = afkData.map((d) => d.discordid);
    let checkFor = false;
    afkList.forEach((d) => {
        if (message.mentions.members.map((m) => m.id).includes(d) && checkFor === false) {
            const { content } = afkData.find((a) => a.discordid === d);
            message.channel.send({ content: `<@${d}> 正在afk: ${content}`, allowedMentions: { parse: [] } });
            checkFor = true;
        }
    });
    if (afkList.includes(message.author.id) && executedCommand !== 'afk') {
        await afkModel.deleteOne({ discordid: message.author.id });
        message.reply('已經解除你的afk!');
    }
};

module.exports = async (client, message) => {
    if (message.guildId !== GUILD_ID) return;

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
