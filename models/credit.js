const mongoose = require('mongoose');

const credit = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    tails_credit: {
        type: mongoose.SchemaTypes.Number,
    },
});

module.exports = mongoose.model('credit', credit);
