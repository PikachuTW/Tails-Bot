const mongoose = require('mongoose');

const introduction = new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
        unique: true,
    },
    intro: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('introduction', introduction);
