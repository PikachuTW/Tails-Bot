const mongoose = require('mongoose');

const economy = new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
        unique: true,
    },
    level: Number,
    cooldown: Number,
});

module.exports = mongoose.model('economy', economy);
