const { MessageEmbed } = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

exports.run = async (client, message, args) => {
    const url = args[0];
    request({
        url: `https://graph.facebook.com/POST_ID?fields=message&access_token=${process.env.FACEBOOK}`,
        path: '',
        method: 'GET',
    });
    (error, response, body) => {
        if (error) {
            return message.channel.send({ content: `出現了些錯誤\n\`\`\`${error.message}\`\`\`` });
        }
        console.log(body);
    };
    // const $ = cheerio.load(body);

    // // 取得貼文者名稱
    // const postAuthor = $('head');
    // console.log(postAuthor);
    // message.reply({
    //     embeds: [
    //         new MessageEmbed()
    //             .setTitle('貼文搜尋結果')
    //             .setColor('#ffae00')
    //             .setDescription(postContent)
    //             .addFields(
    //                 { name: '貼文者名稱', value: postAuthor },
    //                 { name: '讚數', value: likeCount },
    //             ),
    //     ],
    // });
};

exports.conf = {
    aliases: [],
    permLevel: 'Tails',
    description: '搜尋影片',
};
