const mongoose = require('mongoose');

module.exports = mongoose.model('vote', new mongoose.Schema({
    msg: {
        type: String,
        required: true,
        unique: true,
    },
    title: String,
    channel: String,
    time: Number,
    finished: Boolean,
    candidates: Array,
    data: Array,
    count: Number,
}));
