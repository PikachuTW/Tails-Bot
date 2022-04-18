const mongoose = require('mongoose');

const afk = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true,
    },
    content: {
        type: mongoose.SchemaTypes.String,
    },
});

module.exports = mongoose.model('afk', afk);
