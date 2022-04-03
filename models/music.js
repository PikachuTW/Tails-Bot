const mongoose = require('mongoose');

const music = new mongoose.Schema({
    queue: {
        type: mongoose.SchemaTypes.Array,
    },
});

module.exports = mongoose.model('music', music);
