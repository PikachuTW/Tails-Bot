const mongoose = require('mongoose');

const boost = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    user: String,
    timestamp: Number,
    type: String,
});

module.exports = mongoose.model('boost', boost);
