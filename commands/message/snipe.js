const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');
const snipedata = require('../../models/snipedata.js');

exports.run = async (client, message) => {
    let data = await credit.findOne({ discordid: message.author.id });
    if (!data) {
        await credit.create({
            discordid: message.author.id,
            tails_credit: 0,
        });
        data = await credit.findOne({ discordid: message.author.id });
    }

    const before = data.tails_credit;

    if (before >= 75) {
        await credit.findOneAndUpdate({ discordid: message.author.id }, { $inc: { tails_credit: -75 } });

        let sdata = await snipedata.findOne({ channelid: message.channel.id });
        if (!sdata) {
            sdata = await snipedata.create({
                channelid: message.channel.id,
                snipemsg: 'test',
                snipesender: 123,
                snipetime: 'test',
                snipeatt: 'test',
            });
        }

        let msg = sdata.snipemsg;
        let timeget = sdata.snipetime;
        const senderid = sdata.snipesender;
        const senderatt = sdata.snipeatt;

        if (!msg && !senderatt) {
            return message.reply('沒有可Snipe的訊息');
        }

        if (senderid === '123') {
            return message.reply('沒有可Snipe的訊息');
        }

        const bannedWords = ['discord.gg', '.gg/', '.gg /', '. gg /', '. gg/', 'discord .gg /', 'discord.gg /', 'discord .gg/', 'discord .gg', 'discord . gg', 'discord. gg', 'discord gg', 'discordgg', 'discord gg /', 'discord.com/invite', 't.me', 'lamtintinfree'];

        if (bannedWords.some((word) => msg.toLowerCase().includes(word)) && senderid !== '650604337000742934' && senderid !== '889358372170792970') {
            msg = '```已屏蔽```';
            timeget = '屏蔽了🙈';
        }

        const getuser = client.users.cache.get(senderid);
        const embed = new MessageEmbed()
            .setAuthor({ name: getuser.tag })
            .setDescription(`${msg}\n${senderatt}`)
            .setFooter({ text: timeget })
            .setColor('F8DA07');
        if (senderatt == null) embed.setDescription(msg);
        if (senderatt) embed.setImage(senderatt);
        message.reply({ embeds: [embed] });
    } else {
        message.reply('你似乎沒有足夠的tails幣呢(收費75枚) :joy: :pinching_hand:');
    }
};

exports.conf = {
    aliases: ['s'],
    permLevel: 'User',
    description: 'Snipe訊息',
};
