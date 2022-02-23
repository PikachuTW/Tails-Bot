const { MessageEmbed } = require('discord.js');
const credit = require('../../models/credit.js');

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

    if (before >= 5) {
        const result = Math.random();
        let give = 0;
        if (result <= 0.008) {
            if (before - 5 + give < 0) {
                give = (before - 5) * -1;
            }
            else {
                give = -50;
            }
        }
        else if (result <= 0.0375) {
            if (before - 5 + give < 0) {
                give = (before - 5) * -1;
            }
            else {
                give = -20;
            }
        }
        else if (result <= 0.1) {
            if (before - 5 + give < 0) {
                give = (before - 5) * -1;
            }
            else {
                give = -5;
            }
        }
        else if (result <= 0.35) {
            give = 1;
        }
        else if (result <= 0.60) {
            give = 2;
        }
        else if (result <= 0.95) {
            give = 10;
        }
        else if (result <= 0.985) {
            give = 20;
        }
        else if (result <= 0.99996) {
            give = 50;
        }
        else {
            give = 1000;
        }

        await credit.findOneAndUpdate({ 'discordid': message.author.id }, { $inc: { 'tails_credit': give - 5 } });

        const exampleEmbed = new MessageEmbed()
            .setColor('#ffae00')
            .setTitle(`${message.author.tag} 的Tails幣賭博結果`)
            .setDescription(`花了 \`5\` 得到 \`${give}\`\n餘額由 \`${before}\` 變為 \`${before - 5 + give}\``)
            .setThumbnail(message.author.displayAvatarURL({ format: 'png' }))
            .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

        message.reply({ embeds: [exampleEmbed] });

    }
    else {
        message.reply('你似乎沒有足夠的tails幣呢，還想賭錢?(收費5枚) :joy: :pinching_hand:');
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    name: 'bet',
    category: 'Tails幣',
    description: '賭注tails幣',
    usage: 'bet',
};