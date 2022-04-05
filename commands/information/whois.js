const { MessageEmbed } = require('discord.js');
const got = require('got');
const { millify } = require('millify');
const credit = require('../../models/credit.js');
const introduction = require('../../models/introduction.js');

exports.run = async (client, message, args) => {
    try {
        const target = message.mentions.members.first() || message.guild.members.cache.find((member) => member.id === args[0]) || message.member;
        if (!target) return message.reply('請給予有效目標!');

        let pageNum = 0;
        let mee6UserInfo;
        let mee6Res;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                // eslint-disable-next-line no-await-in-loop
                mee6Res = await got.get(`https://mee6.xyz/api/plugins/levels/leaderboard/828450904990154802?limit=1000&page=${pageNum}`, {
                    responseType: 'json',
                });
            } catch {
                mee6UserInfo = undefined;
                break;
            }
            if (mee6Res.statusCode !== 200) {
                mee6UserInfo = undefined;
                break;
            }
            mee6UserInfo = mee6Res.body.players.find((mee6userData) => mee6userData.id === target.id);
            if (mee6UserInfo) {
                mee6UserInfo.rank = pageNum * 1000 + mee6Res.body.players.indexOf(mee6UserInfo) + 1;
                break;
            }
            if (mee6Res.length < 1000) break;
            pageNum += 1;
        }

        const unbRes = await got.get(`https://unbelievaboat.com/api/v1/guilds/828450904990154802/users/${target.id}`, {
            responseType: 'json',
            headers: {
                Authorization: process.env.UNB,
            },
        });

        let creditdata = await credit.findOne({ discordid: target.id });
        if (!creditdata) {
            creditdata = await credit.create({
                discordid: target.id,
                tails_credit: 0,
            });
        }
        let introdata = await introduction.findOne({ discordid: target.id });
        if (!introdata) {
            introdata = await introduction.create({
                discordid: target.id,
                intro: '無',
            });
        }

        const creditrank = await credit.find({ tails_credit: { $gte: creditdata.tails_credit } });

        const tcdata = creditdata.tails_credit === Infinity ? Infinity : millify(creditdata.tails_credit);

        if (!mee6UserInfo) {
            message.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL({ format: 'png', dynamic: true }) })
                        .setDescription(`<@${target.id}>`)
                        .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                        .addField('加入日期', `\`\`\`${target.joinedAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
                        .addField('創建日期', `\`\`\`${target.user.createdAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
                        .addField('林天天幣', `\`\`\`${unbRes.body.total === 'Infinity' ? Infinity : millify(unbRes.body.total)}\`\`\``, true)
                        .addField('林天天幣排名', `\`\`\`${unbRes.body.rank ? unbRes.body.rank : '無'}\`\`\``, true)
                        .addField('Tails幣', `\`\`\`${tcdata}\`\`\``, true)
                        .addField('Tails幣排名', `\`\`\`${creditrank.length}\`\`\``, true)
                        .addField('自我介紹', `\`\`\`${introdata.intro}\`\`\``)
                        .addField(`身分組 [${target.roles.cache.filter((roles) => roles.id !== message.guild.id).size}]`, `${target.roles.cache.filter((roles) => roles.id !== message.guild.id).sort((a, b) => b.rawPosition - a.rawPosition).map((role) => role.toString()).join('')}`)
                        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' })],
            });
        } else {
            message.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL({ format: 'png', dynamic: true }) })
                        .setDescription(`<@${target.id}>`)
                        .setThumbnail(target.displayAvatarURL({ format: 'png', dynamic: true }))
                        .addField('加入日期', `\`\`\`${target.joinedAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
                        .addField('創建日期', `\`\`\`${target.user.createdAt.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\`\`\``, true)
                        .addField('Mee6等級', `\`\`\`${mee6UserInfo.level}\`\`\``, true)
                        .addField('Mee6總Xp數', `\`\`\`${mee6UserInfo.xp}\`\`\``, true)
                        .addField('Mee6排名', `\`\`\`${mee6UserInfo.rank}\`\`\``, true)
                        .addField('林天天幣', `\`\`\`${unbRes.body.total === 'Infinity' ? Infinity : millify(unbRes.body.total)}\`\`\``, true)
                        .addField('林天天幣排名', `\`\`\`${unbRes.body.rank ? unbRes.body.rank : '無'}\`\`\``, true)
                        .addField('Tails幣', `\`\`\`${tcdata}\`\`\``, true)
                        .addField('Tails幣排名', `\`\`\`${creditrank.length}\`\`\``, true)
                        .addField('自我介紹', `\`\`\`${introdata.intro}\`\`\``)
                        .addField(`身分組 [${target.roles.cache.filter((roles) => roles.id !== message.guild.id).size}]`, `${target.roles.cache.filter((roles) => roles.id !== message.guild.id).sort((a, b) => b.rawPosition - a.rawPosition).map((role) => role.toString()).join('')}`)
                        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' })],
            });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.conf = {
    aliases: ['profile'],
    permLevel: 'User',
    description: '獲取成員的數據',
    usage: 'whois',
};
