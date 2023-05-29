const mongoose = require('mongoose');

module.exports = mongoose.model('credit', new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
        unique: true,
    },
    tails_credit: Number,
}));
