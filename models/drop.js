const mongoose = require('mongoose');

const drop = new mongoose.Schema({
    timestamp: {
        type: mongoose.SchemaTypes.Number,
        required: true,
        unique: true,
    },
    claimed: {
        type: mongoose.SchemaTypes.Array,
    },
    mid: {
        type: mongoose.SchemaTypes.String,
    },
});

module.exports = mongoose.model('drop', drop);
