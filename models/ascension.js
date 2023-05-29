const mongoose = require('mongoose');

const ascension = new mongoose.Schema({
    day: {
        type: Number,
        required: true,
        unique: true,
    },
    level: Number,
});

module.exports = mongoose.model('ascension', ascension);
