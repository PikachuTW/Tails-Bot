const mongoose = require('mongoose');

const ticket = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    channelid: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    closed: {
        type: mongoose.SchemaTypes.Boolean,
        required: true,
    },
});

module.exports = mongoose.model('ticket', ticket);