const got = require('got');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    let target;
    if (args[0]) {
        target = targetGet(message, args) || await client.users.fetch(args[0]) || message.member;
    } else {
        target = message.member;
    }
    target = await target.user.fetch();
    if (!target.banner) return message.reply('此用戶沒有banner');
    const res = await got.head(`https://cdn.discordapp.com/banners/${target.id}/${target.banner}`);
    message.reply(`https://cdn.discordapp.com/banners/${target.id}/${target.banner}.${res.headers['content-type'].slice(6)}?size=4096`);
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '獲取你的banner',
};
