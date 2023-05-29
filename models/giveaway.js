const mongoose = require('mongoose');

const giveaway = new mongoose.Schema({
    messageid: {
        type: String,
        required: true,
        unique: true,
    },
    channelid: String,
    time: Number,
    winner: Number,
    users: Array,
});

module.exports = mongoose.model('giveaway', giveaway);
