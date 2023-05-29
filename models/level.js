const mongoose = require('mongoose');

const level = new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
        unique: true,
    },
    daily: Array,
});

module.exports = mongoose.model('level', level);
