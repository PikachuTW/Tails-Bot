const mongoose = require('mongoose');

module.exports = mongoose.model('snipe', new mongoose.Schema({
    channelid: {
        type: String,
        required: true,
        unique: true,
    },
    snipemsg: String,
    snipetime: String,
    snipesender: String,
    snipeatt: Array,
}));
