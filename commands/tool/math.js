const { evaluate } = require('mathjs');

exports.run = async (client, message, args) => {
    const formula = args.join(' ');
    if (!formula) return message.reply('請提供算式!');
    message.reply(`**[答案]** ${evaluate(formula)}`);
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '計算',
    usage: 'math',
};
