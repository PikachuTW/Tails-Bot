const mongoose = require('mongoose');

module.exports = mongoose.model('ticket', new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
    },
    channelid: {
        type: String,
        required: true,
    },
    closed: {
        type: Boolean,
        required: true,
    },
}));
