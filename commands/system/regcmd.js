const { ContextMenuCommandBuilder, SlashCommandBuilder } = require('@discordjs/builders');

exports.run = async (client, message) => {
    const commands = [
        new ContextMenuCommandBuilder()
            .setName('翻譯成中文')
            .setType(3),
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('回傳延遲值'),
        new SlashCommandBuilder()
            .setName('cb')
            .setDescription('投稿匿名貼文'),
        new SlashCommandBuilder()
            .setName('tw')
            .setDescription('翻譯成中文')
            .addStringOption((options) => options
                .setName('內容')
                .setDescription('要翻譯的內容')
                .setRequired(true)),
    ];

    try {
        message.guild.commands.set(commands);
        message.reply('應用程式命令註冊成功!');
    } catch (error) {
        console.error(error);
        try {
            message.reply('應用程式命令註冊失敗 :frog:');
        } catch { }
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '上傳應用程式命令',
};
