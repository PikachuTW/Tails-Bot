const mongoose = require('mongoose');

const marry = new mongoose.Schema({
    users: Array,
    started: Number,
    points: 0,
    cd: {
        kiss: 0,
        sex: 0,
        hug: 0,
        shopping: 0,
    },
});

module.exports = mongoose.model('marry', marry);
