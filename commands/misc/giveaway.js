const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const giveaway = require('../../models/giveaway');

exports.run = async (client, message, args) => {
    if (!message.member.roles.cache.has('929371428451668019') && !message.member.roles.cache.has('856377783163944970')) return message.reply('你需要管理員或Giveaway身分組 :frog:');
    if (args[0] === 'start') {
        if (!message.member.roles.cache.has('929371428451668019') && !message.member.roles.cache.has('870741338960830544')) return message.reply('你必須要有Giveaway身分組!');
        if (!args[1]) return message.reply('請提供一個有效時間');
        const msCount = ms(args[1]);
        if (!Number.isInteger(msCount)) return message.reply('請提供一個有效時間');
        if (msCount < 1000 || msCount > 604800000) return message.reply('請提供1秒到7天內的時間');
        if (!args[2]) return message.reply('請提供一個有效人數或獎品');
        let winnerBoolean = false;
        let winnerCount = 1;
        if (args[2].endsWith('w')) {
            winnerBoolean = true;
            winnerCount = Number(args[2].slice(0, -1));
            if (winnerCount > 15) return message.reply('人數不能大於15!');
        }
        if (winnerBoolean && !args[3]) return message.reply('請提供有效獎品');
        const prize = winnerBoolean ? args.slice(3).join(' ') : args.slice(2).join(' ');
        message.delete();
        const secCount = Math.round((msCount + Date.now()) / 1000);
        const msg = await message.channel.send({
            content: '<:frog4:931773626057912420> 抽獎 <:frog4:931773626057912420>',
            embeds: [
                new MessageEmbed()
                    .setAuthor({ name: prize })
                    .setColor('F8DA07')
                    .setDescription(`點擊台蛙圖示 <:frog4:931773626057912420> 進入抽獎\n結束時間: <t:${secCount}:R> (<t:${secCount}:f>)\n中獎者數量: ${winnerCount}\n舉辦者: ${message.member}`)
                    .setFooter({ text: `結束於 • ${new Date(msCount + Date.now()).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}` }),
            ],
        });
        await msg.react('931773626057912420');
        await giveaway.create({
            messageid: msg.id, channelid: msg.channelId, winner: winnerCount, time: msCount + Date.now(),
        });
    } else if (args[0] === 'end') {
        if (!args[1]) return message.reply('請提供該訊息id');
        const data = await giveaway.findOne({ messageid: args[1] });
        if (!data) return message.reply('無效訊息id');
        let reactUsers;
        if (data.time >= Date.now()) {
            const Channel = client.channels.cache.get(data.channelid);
            const msg = await Channel.messages.fetch(data.messageid);
            if (!msg || !Channel) {
                await giveaway.deleteOne({ messageid: data.messageid });
                return;
            }
            reactUsers = msg.reactions.cache.get('931773626057912420').users.cache.map((u) => u.id).filter((i) => i !== '889358372170792970');
            await giveaway.updateOne({ messageid: args[1] }, { time: Date.now() - 60000, users: reactUsers });
        } else {
            reactUsers = data.users;
        }

        if (reactUsers.length === 0) {
            message.reply('沒有人參加抽獎 🐸');
            await giveaway.deleteOne({ messageid: data.messageid });
            return;
        }
        let winners = [];
        if (reactUsers.length <= data.winner) {
            winners = reactUsers;
        }
        while (winners.length < data.winner) {
            // eslint-disable-next-line no-await-in-loop
            const winUser = await client.users.fetch(reactUsers[Math.floor((Math.random() * reactUsers.length))]);
            if (winners.indexOf(winUser) === -1) {
                winners.push(winUser);
            }
        }
        message.reply(`恭喜 ${winners.join(' ')} 中獎 😭👏`);
    } else {
        message.reply('請輸入模式!');
    }
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description: '抽獎',
};
