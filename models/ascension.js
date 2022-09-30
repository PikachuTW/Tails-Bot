const mongoose = require('mongoose');

const ascension = new mongoose.Schema({
    day: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true,
    },
    level: {
        type: mongoose.SchemaTypes.Number,
    },
});

module.exports = mongoose.model('ascension', ascension);
