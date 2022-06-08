const mongoose = require('mongoose');

const giveaway = new mongoose.Schema({
    messageid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    channelid: {
        type: mongoose.SchemaTypes.String,
    },
    time: {
        type: mongoose.SchemaTypes.Number,
    },
    winner: {
        type: mongoose.SchemaTypes.Number,
    },
    users: {
        type: mongoose.SchemaTypes.Array,
    },
});

module.exports = mongoose.model('giveaway', giveaway);
