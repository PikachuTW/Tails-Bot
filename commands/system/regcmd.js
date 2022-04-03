const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

exports.run = async (client, message) => {
    const commands = [
        new ContextMenuCommandBuilder()
            .setDefaultPermission(true)
            .setName('翻譯成中文')
            .setType(3),
    ]
        .map((command) => command.toJSON());

    (async () => {
        try {
            console.log('開始註冊應用程式命令');
            await rest.put(
                Routes.applicationGuildCommands(client.user.id, message.guild.id),
                { body: commands },
            );
            console.log('應用程式命令註冊成功');
            message.reply('應用程式命令註冊成功!');
        } catch (error) {
            console.error(error);
            try {
                message.reply('應用程式命令註冊失敗 :frog:');
            } catch {}
        }
    })();
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
};

exports.help = {
    name: 'regcmd',
    description: '上傳應用程式命令',
    usage: 'regcmd',
};
