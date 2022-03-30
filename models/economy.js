const mongoose = require('mongoose');

const economy = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    level: {
        type: mongoose.SchemaTypes.Number,
    },
    cooldown: {
        type: mongoose.SchemaTypes.Number,
    }
});

module.exports = mongoose.model('economy', economy);