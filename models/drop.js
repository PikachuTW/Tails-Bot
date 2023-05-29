const mongoose = require('mongoose');

const drop = new mongoose.Schema({
    timestamp: {
        type: Number,
        required: true,
        unique: true,
    },
    claimed: Array,
    mid: String,
});

module.exports = mongoose.model('drop', drop);
