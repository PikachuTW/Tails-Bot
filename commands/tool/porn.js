const Neko = require('nekos.life');
const { MessageEmbed } = require('discord.js');

const { nsfw } = new Neko();

exports.run = async (client, message, args) => {
    if (!message.channel.nsfw || message.channel.id !== '832221347236282408') return message.reply('請到 <#832221347236282408> 使用');
    const target = typeof args[0] === 'string' ? args[0].toLowerCase() : args[0];
    const list = [
        'random',
        'pussy',
        'neko',
        'nekogif',
        'lesbian',
        'kuni',
        'cumsluts',
        'classic',
        'boobs',
        'bj',
        'anal',
        'avatar',
        'yuri',
        'trap',
        'tits',
        'girlsolo',
        'girlsologif',
        'pussywankgif',
        'pussyart',
        'kemonomimi',
        'kitsune',
        'keta',
        'holo',
        'holoero',
        'hentai',
        'futanari',
        'femdom',
        'feetgif',
        'erofeet',
        'feet',
        'ero',
        'erokitsune',
        'erokemonomimi',
        'eroneko',
        'eroyuri',
        'cumarts',
        'blowjob',
        'spank',
        'gasm',
    ];
    let res;

    switch (target) {
    case 'random':
        res = await nsfw.randomHentaiGif();
        break;
    case 'pussy':
        res = await nsfw.pussy();
        break;
    case 'neko':
        res = await nsfw.neko();
        break;
    case 'nekogif':
        res = await nsfw.nekoGif();
        break;
    case 'lesbian':
        res = await nsfw.lesbian();
        break;
    case 'kuni':
        res = await nsfw.kuni();
        break;
    case 'cumsluts':
        res = await nsfw.cumsluts();
        break;
    case 'classic':
        res = await nsfw.classic();
        break;
    case 'boobs':
        res = await nsfw.boobs();
        break;
    case 'bj':
        res = await nsfw.bJ();
        break;
    case 'anal':
        res = await nsfw.anal();
        break;
    case 'avatar':
        res = await nsfw.avatar();
        break;
    case 'yuri':
        res = await nsfw.yuri();
        break;
    case 'trap':
        res = await nsfw.trap();
        break;
    case 'tits':
        res = await nsfw.tits();
        break;
    case 'girlsolo':
        res = await nsfw.girlSolo();
        break;
    case 'girlsologif':
        res = await nsfw.girlSoloGif();
        break;
    case 'pussywankgif':
        res = await nsfw.pussyWankGif();
        break;
    case 'pussyart':
        res = await nsfw.pussyArt();
        break;
    case 'kemonomimi':
        res = await nsfw.kemonomimi();
        break;
    case 'kitsune':
        res = await nsfw.kitsune();
        break;
    case 'keta':
        res = await nsfw.keta();
        break;
    case 'holo':
        res = await nsfw.holo();
        break;
    case 'holoero':
        res = await nsfw.holoEro();
        break;
    case 'hentai':
        res = await nsfw.hentai();
        break;
    case 'futanari':
        res = await nsfw.futanari();
        break;
    case 'femdom':
        res = await nsfw.femdom();
        break;
    case 'feetgif':
        res = await nsfw.feetGif();
        break;
    case 'erofeet':
        res = await nsfw.eroFeet();
        break;
    case 'feet':
        res = await nsfw.feet();
        break;
    case 'ero':
        res = await nsfw.ero();
        break;
    case 'erokitsune':
        res = await nsfw.eroKitsune();
        break;
    case 'erokemonomimi':
        res = await nsfw.eroKemonomimi();
        break;
    case 'eroneko':
        res = await nsfw.eroNeko();
        break;
    case 'eroyuni':
        res = await nsfw.eroYuri();
        break;
    case 'cumarts':
        res = await nsfw.cumArts();
        break;
    case 'blowjob':
        res = await nsfw.blowJob();
        break;
    case 'spank':
        res = await nsfw.spank();
        break;
    case 'gasm':
        res = await nsfw.gasm();
        break;
    default:
        return message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('Tails Bot 色情指令列表')
                    .setColor('#ffae00')
                    .setDescription(`\`${list.join('` `')}\``),
            ],
        });
    }
    message.reply({
        embeds: [
            new MessageEmbed()
                .setColor('#ffae00')
                .setImage(res.url),
        ],
    });
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
};

exports.help = {
    description: '色情',
    usage: 'porn',
};
