/* eslint-disable no-loop-func */
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    let num = parseInt(args[0], 10);
    if (!num || ![0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(num)) num = 0;
    const words = [
        [['a', 'あ'], ['i', 'い'], ['u', 'う'], ['e', 'え'], ['o', 'お']],
        [['ka', 'か'], ['ki', 'き'], ['ku', 'く'], ['ke', 'け'], ['ko', 'こ']],
        [['sa', 'さ'], ['shi', 'し'], ['su', 'す'], ['se', 'せ'], ['so', 'そ']],
        [['ta', 'た'], ['chi', 'ち'], ['tsu', 'つ'], ['te', 'て'], ['to', 'と']],
        [['na', 'な'], ['ni', 'に'], ['nu', 'ぬ'], ['ne', 'ね'], ['no', 'の']],
        [['ha', 'は'], ['hi', 'ひ'], ['fu', 'ふ'], ['he', 'へ'], ['ho', 'ほ']],
        [['ma', 'ま'], ['mi', 'み'], ['mu', 'む'], ['me', 'め'], ['mo', 'も']],
        [['ya', 'や'], ['yu', 'ゆ'], ['yo', 'よ']],
        [['ra', 'ら'], ['ri', 'り'], ['ru', 'る'], ['re', 'れ'], ['ro', 'ろ']],
        [['wa', 'わ'], ['wo', 'を'], ['n', 'ん']],
    ];
    let data;
    if (num === 0) {
        data = words.flat();
    } else {
        data = words[num - 1];
    }
    const cd = client.container.fiftycd.get(message.author.id);
    if (cd === true) return;
    client.container.fiftycd.set(message.author.id, true);
    let count = 0;
    let success = true;
    const ask = async () => {
        const choose = data[Math.floor(Math.random() * data.length)];
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setColor('#ffae00')
                    .setDescription(`第${count + 1}題：**${choose[1]}**`),
            ],
        });
        const filter = (m) => m.channelId === message.channelId && m.author.id === message.author.id;
        try {
            const collected = await message.channel.awaitMessages({
                filter, max: 1, time: 25000, errors: ['time'],
            });
            if (collected.first().content.toLowerCase() === 'cancel') {
                success = false;
                count = 100;
                message.channel.send(`已結束這個測驗 ${message.member} 詳解: **${choose[0]} ${choose[1]}**`);
            } else if (collected.first().content.toLowerCase() === choose[0].toLowerCase()) {
                collected.first().reply(`恭喜答對! 詳解: **${choose[0]} ${choose[1]}**`);
                count += 1;
            } else {
                message.channel.send(`${message.member} 你答錯了 :scream: 詳解: **${choose[0]} ${choose[1]}**`);
                if (count > 0) count -= 1;
            }
        } catch {
            success = false;
            count = 100;
            message.channel.send(`已結束這個測驗 ${message.member} 詳解: **${choose[0]} ${choose[1]}**`);
        }
    };
    while (count < 10) {
        // eslint-disable-next-line no-await-in-loop
        await ask();
    }
    if (success) {
        message.reply('恭喜全部答對!');
        message.reply(':clap: :clap: :clap:');
    }
    client.container.fiftycd.set(message.author.id, false);
};

exports.conf = {
    aliases: [],
    permLevel: 'User',
    description:
        `1. a · i · u · e · o
2. ka · ki · ku · ke · ko
3. sa · shi · su · se · so
4. ta · chi · tsu · te · to
5. na · ni · nu · ne · no
6. ha · hi · fu · he · ho
7. ma · mi · mu · me · mo
8. ya · yu · yo
9. ra · ri · ru · re · ro
10. wa · wo · n`,
};
