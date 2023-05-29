const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const si = require('systeminformation');
require('moment-duration-format');

exports.run = async (client, message) => {
    const msToSec = (ms) => moment.duration(ms).format(' D [天] H [小時] m [分] s [秒]');
    // eslint-disable-next-line no-bitwise
    const byteToGB = (byte) => Math.round((byte / (1 << 30)) * 100) / 100;
    const cpu = await si.cpu();
    const mem = await si.mem();
    const fsSize = await si.fsSize();

    message.reply({
        embeds: [
            new MessageEmbed()
                .setTitle('詳細資訊')
                .setColor('#ffae00')
                .addFields([
                    { name: 'Discord.js 版本', value: `\`v${Discord.version}\``, inline: true },
                    { name: 'Node 版本', value: `\`${process.version}\``, inline: true },
                    { name: '記憶體使用量', value: `\`${byteToGB(mem.active)}GB/${byteToGB(mem.total)}GB\``, inline: true },
                    { name: '上線時間', value: `\`${msToSec(client.uptime)}\``, inline: true },
                    { name: '開機時間', value: `\`${msToSec(si.time().uptime * 1000)}\``, inline: true },
                    { name: '系統型號', value: `\`${(await si.system()).model}\``, inline: true },
                    { name: 'CPU 型號', value: `\`${cpu.family}\``, inline: true },
                    { name: 'CPU 核心數', value: `\`${cpu.cores}核\``, inline: true },
                    { name: 'CPU 時脈', value: `\`${(await si.cpuCurrentSpeed()).avg}GHz\``, inline: true },
                    { name: '系統架構', value: `\`${process.arch}\``, inline: true },
                    { name: '作業系統', value: `\`\`${(await si.osInfo()).distro}\`\``, inline: true },
                    { name: '硬碟大小', value: `\`\`${byteToGB(fsSize.reduce((previous, a) => previous + a.used, 0))}GB/${byteToGB(fsSize.reduce((previous, a) => previous + a.size, 0))}GB\`\``, inline: true },
                ]),
        ],
    });
};

exports.conf = {
    aliases: ['botinfo'],
    permLevel: 'User',
    description: '回傳機器人數據',
};
