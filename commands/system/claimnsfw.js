/* eslint-disable no-unused-vars */
const {
    MessageActionRow, MessageSelectMenu, MessageEmbed,
} = require('discord.js');

exports.run = async (client, message) => {
    await message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('RED')
                .setTitle('18禁頻道說明')
                .setDescription('本伺服器有大量的色情頻道，你可以藉由在這裡領取身份組進入，或者如果你不想看到，你也可以選擇不領取。另外，如果有想要新增的分類頻道，可以向 <@650604337000742934> 建議\n\n主聊天室： <#975025966990626816>\n\n分類區： <#1076192484583026768> <#1076192551238893629> <#1076192585695109181> <#1076192866084335677> <#1076194598499663984>'),
        ],
    });
    await message.channel.send({
        embeds: [
            new MessageEmbed()
                .setColor('RED')
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
