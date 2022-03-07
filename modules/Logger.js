/* eslint-disable indent */
const moment = require('moment-timezone');

exports.log = (content, type = 'log') => {
    const timestamp = `[${moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss')}]:`;

    switch (type) {
        case 'log': return console.log(`${timestamp} LOG ${content} `);
        case 'warn': return console.log(`${timestamp} WARN ${content} `);
        case 'error': return console.log(`${timestamp} ERROR ${content} `);
        case 'debug': return console.log(`${timestamp} DEBUG ${content} `);
        case 'cmd': return console.log(`${timestamp} CMD ${content}`);
        case 'ready': return console.log(`${timestamp} READY ${content}`);
        case 'eval': return console.log(`${timestamp} EVAL ${content}`);
        default: throw new TypeError('Logger type must be either warn, debug, log, ready, cmd or error.');
    }
};

exports.error = (...args) => this.log(...args, 'error');

exports.warn = (...args) => this.log(...args, 'warn');

exports.debug = (...args) => this.log(...args, 'debug');

exports.cmd = (...args) => this.log(...args, 'cmd');
