/* eslint-disable no-unused-vars */
const {
    MessageActionRow, MessageSelectMenu, MessageEmbed, MessageAttachment,
} = require('discord.js');

exports.run = async (client, message) => {
    await message.channel.send({
        files: [
            new MessageAttachment('images/職位身份組.png'),
        ],
    });
    await message.channel.send({ content: '管理人員職責為**維護聊天室秩序**及**監督管理層級較低的管理人員**，通常是藉由選舉產生，若行為違反特定規定，不排除有革職的可能性\n\n> <@&832213672695693312> 擁有成員警告及禁言權限、刪除聊天室訊息權限\n> <@&856377783163944970> 擁有成員踢出、封鎖、修改暱稱、免受洗板自動管理\n> <@&870741338960830544> 擁有大量訊息刪除、革職管理人員、提及所有人權限', allowedMentions: { parse: [] } });
    await message.channel.send({
        files: [
            new MessageAttachment('images/活躍身份組.png'),
        ],
    });
    await message.channel.send({ content: '活躍身份組可以經由在限定時間內訊息量達標於特定數目獲得\n\n> <@&856808847251734559>\n> 條件: 3天100則訊息\n> 權限: 修改暱稱/部分投票/部分抽獎權限/t!snipe權限\n\n> <@&1014857925107392522>\n> 條件: 3天200則訊息\n> 權限: 創建貼文權限\n\n> <@&861459068789850172>\n> 條件: 2天250則訊息\n> 權限: 目前無特殊權限', allowedMentions: { parse: [] } });
    await message.channel.send({
        files: [
            new MessageAttachment('images/頭銜身份組.png'),
        ],
    });
    await message.channel.send({ content: '<@&881911118845587477> 條件: 伺服器官方認證小粉紅 權限: 在公告擁有可開關的提及所有人權限\n<@&884486058534907916> 條件: 口頭申請或是強制給予即可獲得 權限: 無\n<@&976472022651662336> 條件: 在聊天室放置任何正面vtuber相關內容即可獲得 權限: 無', allowedMentions: { parse: [] } });
    await message.channel.send({
        files: [
            new MessageAttachment('images/其他身份組.png'),
        ],
    });
    await message.channel.send({ content: '<@&872393344309932042> <@650604337000742934> 本人親自製作的機器人\n<@&828516633738870794> 普通機器人\n<@&868875272601104424> 曾經擔任管理人員且非因犯法或強迫革職原因而降職者，即可申請\n<@&962401982281289808> 失去任何權限，被限制只能在 <#962401948538130482> 發送訊息\n<@&929371428451668019> 辦抽獎之權限', allowedMentions: { parse: [] } });
    await message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('🌏 國家/地區身分組領取')
                .setDescription('請在這裡領取你的國家/地區身分組，可以多重領取\n\n🇹🇼 <@&856410483120799744> 台灣 Taiwan\n🇨🇳 <@&856410560622362633> 中國 China\n🇭🇰 <@&856410586879229982> 香港 Hong Kong\n🇲🇾 <@&856410631494565928> 馬來西亞 Malaysia\n🇺🇸 <@&856412324676108289> 美國 United States\n🇨🇦 <@&995519246811541604> 加拿大 Canada\n🇲🇴 <@&1008055435212898335> 澳門 Macau'),
        ],
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('countryRole')
                        .setPlaceholder('請選擇身分組 Please select roles')
                        .addOptions([
                            {
                                label: '台灣 Taiwan',
                                value: '856410483120799744',
                                emoji: '🇹🇼',
                            },
                            {
                                label: '中國 China',
                                value: '856410560622362633',
                                emoji: '🇨🇳',
                            },
                            {
                                label: '香港 Hong Kong',
                                value: '856410586879229982',
                                emoji: '🇭🇰',
                            },
                            {
                                label: '馬來西亞 Malaysia',
                                value: '856410631494565928',
                                emoji: '🇲🇾',
                            },
                            {
                                label: '美國 United States',
                                value: '856412324676108289',
                                emoji: '🇺🇸',
                            },
                            {
                                label: '加拿大 Canada',
                                value: '995519246811541604',
                                emoji: '🇨🇦',
                            },
                            {
                                label: '澳門 Macau',
                                value: '1008055435212898335',
                                emoji: '🇲🇴',
                            },
                            {
                                label: '清除身分組 Clear All',
                                value: 'clear',
                                emoji: '❌',
                            },
                        ]),
                ),
        ],
    });

    await message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('👥 性別身分組領取')
                .setDescription('請在這裡領取你的性別身分組'),
        ],
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('sexRole')
                        .setPlaceholder('請選擇身分組 Please select roles')
                        .addOptions([
                            {
                                label: '男性',
                                value: '874567548098736129',
                                emoji: '🟦',
                            },
                            {
                                label: '女性',
                                value: '874567579539222568',
                                emoji: '🟥',
                            },
                            {
                                label: '清除身分組 Clear All',
                                value: 'clear',
                                emoji: '❌',
                            },
                        ]),
                ),
        ],
    });
    await message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setTitle('🔞 18禁頻道身分組領取')
                .setDescription('領取這個身分組就能看到18禁頻道!'),
        ],
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId('nsfw')
                        .setPlaceholder('領取18禁頻道身分組 Claim NSFW channel role')
                        .addOptions([
                            {
                                label: '領取',
                                value: 'add',
                                emoji: '✅',
                            },
                            {
                                label: '移除',
                                value: 'remove',
                                emoji: '❌',
                            },
                        ]),
                ),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '發送"領取身份組"',
};
