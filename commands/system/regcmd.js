const { ContextMenuCommandBuilder, SlashCommandBuilder } = require('@discordjs/builders');

exports.run = async (client, message) => {
    const commands = [
        new ContextMenuCommandBuilder()
            .setDefaultPermission(true)
            .setName('翻譯成中文')
            .setType(3),
        new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName('ping')
            .setDescription('回傳延遲值'),
        new SlashCommandBuilder()
            .setDefaultPermission(true)
            .setName('test')
            .setDescription('測試'),
    ]
        .map((command) => command.toJSON());

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
    usage: 'regcmd',
};
