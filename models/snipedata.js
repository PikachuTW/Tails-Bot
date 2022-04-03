const mongoose = require('mongoose');

const snipedata = new mongoose.Schema({
    channelid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    snipemsg: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    snipesender: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    snipetime: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    snipeatt: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

module.exports = mongoose.model('snipedata', snipedata);
