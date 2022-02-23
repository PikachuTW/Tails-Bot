const config = require('../../config.js');
exports.run = async (client, message, args) => {
    const { container } = client;
    if (!args || args.length < 1) return message.reply('請提供有效指令!');
    const command = container.commands.get(args[0]) || container.commands.get(container.aliases.get(args[0]));
    // Check if the command exists and is valid
    if (!command) {
        return message.reply('這個指令不存在哦');
    }
    // the path is relative to the *current folder*, so just ./filename.js
    delete require.cache[require.resolve(`./${command.help.name}.js`)];
    // We also need to delete and reload the command from the container.commands Enmap
    container.commands.delete(command.help.name);
    const props = require(`./${command.help.name}.js`);
    container.commands.set(command.help.name, props);

    message.reply({ content: `\`${command.help.name}\` 已被重新載入`, allowedMentions: { repliedUser: 'true' } });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['re'],
    permLevel: 'Tails',
};

exports.help = {
    name: 'reload',
    category: '系統',
    description: '重新載入命令',
    usage: 'reload [command]',
};