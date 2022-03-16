const mongoose = require('mongoose');

const misc = new mongoose.Schema({
    key: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    value_num: {
        type: mongoose.SchemaTypes.Number,
    },
    value_string: {
        type: mongoose.SchemaTypes.String,
    },
    value_arr: {
        type: mongoose.SchemaTypes.Array,
    },
    value_object: {
        type: mongoose.SchemaTypes.Mixed,
    },
    value_map: {
        type: mongoose.SchemaTypes.Map,
    },
});

module.exports = mongoose.model('misc', misc);