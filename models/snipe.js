const mongoose = require('mongoose');

const snipe = new mongoose.Schema({
    channelid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    snipemsg: String,
    snipetime: String,
    snipesender: String,
    snipeatt: Array,
});

module.exports = mongoose.model('snipe', snipe);
