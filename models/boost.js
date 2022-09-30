const mongoose = require('mongoose');

const boost = new mongoose.Schema({
    id: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    user: {
        type: mongoose.SchemaTypes.String,
    },
    timestamp: {
        type: mongoose.SchemaTypes.Number,
    },
    type: {
        type: mongoose.SchemaTypes.String,
    },
});

module.exports = mongoose.model('boost', boost);
