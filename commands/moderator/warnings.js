const { MessageEmbed } = require('discord.js');
const warning = require('../../models/warning.js');
const { targetGet } = require('../../modules/functions.js');

exports.run = async (client, message, args) => {
    const target = targetGet(message, args);
    if (!target) return message.reply('請給予有效目標!');

    const warntotal = await warning.find({ discordid: target.id });

    if (warntotal.length === 0) {
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(`**🐸 ${target.user.newName} 沒有任何警告**`),
            ],
        });
        return;
    }

    let warnres;

    if (warntotal.length > 10) {
        warnres = await warning.find({ discordid: target.id }).sort({ warnstamp: 1 }).skip(warntotal.length - 10);
    } else {
        warnres = await warning.find({ discordid: target.id }).sort({ warnstamp: 1 });
    }

    const warningembed = new MessageEmbed()
        .setColor('#ffae00')
        .setAuthor({ name: `${target.user.newName} 目前有 ${warntotal.length} 則警告`, iconURL: target.displayAvatarURL({ format: 'png', dynamic: true }) })
        .setFooter({ text: 'Tails Bot | Made By Tails', iconURL: 'https://i.imgur.com/IOgR3x6.png' });

    for (let i = 0; i < warnres.length; i++) {
        const mod = client.users.cache.get(warnres[i].warnstaff);
        // eslint-disable-next-line no-underscore-dangle
        warningembed.addField(`ID: ${warnres[i]._id} | 管理人員: ${mod ? mod.newName : 'User Left'}`, `${warnres[i].warncontent} - ${new Date(warnres[i].warnstamp).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}`);
    }

    message.reply({ embeds: [warningembed] });
};

exports.conf = {
    aliases: [],
    permLevel: 'Staff',
    description: '查看成員的警告',
};
