const mongoose = require('mongoose');

const invest = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    savedata: {
        type: mongoose.SchemaTypes.Number,
        required: false,
    },
    claimcooldown: {
        type: mongoose.SchemaTypes.Number,
        required: false,
    },
});

module.exports = mongoose.model('invest', invest);
