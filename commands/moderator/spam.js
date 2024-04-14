// eslint-disable-next-line no-unused-vars
exports.run = async (client, message, [targetArg, ..._]) => {
    const cmd = client.container.commands.get('mute');
    await cmd.run(client, message, [targetArg, '1m', 'spam']);
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '對於用戶spam進行處分',
};
