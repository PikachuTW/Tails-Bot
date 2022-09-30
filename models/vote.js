const mongoose = require('mongoose');

const vote = new mongoose.Schema({
    msg: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    title: {
        type: mongoose.SchemaTypes.String,
    },
    channel: {
        type: mongoose.SchemaTypes.String,
    },
    time: {
        type: mongoose.SchemaTypes.Number,
    },
    finished: {
        type: mongoose.SchemaTypes.Boolean,
    },
    candidates: {
        type: mongoose.SchemaTypes.Array,
    },
    data: {
        type: mongoose.SchemaTypes.Array,
    },
    count: {
        type: mongoose.SchemaTypes.Number,
    },
});

module.exports = mongoose.model('vote', vote);
