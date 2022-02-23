const mongoose = require('mongoose');

const level = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    timestamp: {
        type: mongoose.SchemaTypes.Number,
    },
    daily: {
        type: mongoose.SchemaTypes.Array,
    },
});

module.exports = mongoose.model('level', level);