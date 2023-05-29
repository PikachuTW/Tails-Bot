const mongoose = require('mongoose');

module.exports = mongoose.model('misc', new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value_num: Number,
    value_string: String,
    value_arr: Array,
    value_object: {
        type: mongoose.SchemaTypes.Mixed,
    },
    value_map: Map,
}));
