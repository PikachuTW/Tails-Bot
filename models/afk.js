const mongoose = require('mongoose');

const afk = new mongoose.Schema({
    discordid: {
        type: String,
        required: true,
        unique: true,
    },
    content: String,
});

module.exports = mongoose.model('afk', afk);
