const mongoose = require('mongoose');

const introduction = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    intro: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
});

module.exports = mongoose.model('introduction', introduction);
