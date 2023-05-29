const mongoose = require('mongoose');

module.exports = mongoose.model('warning', new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
    },
    warnstamp: {
        type: Number,
        required: true,
    },
    warncontent: {
        type: String,
        required: true,
    },
    warnstaff: {
        type: String,
        required: true,
    },
}));
