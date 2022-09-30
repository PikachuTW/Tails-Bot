const mongoose = require('mongoose');

const chinanew = new mongoose.Schema({
    discordid: {
        type: mongoose.SchemaTypes.String,
    },
    discordtag: {
        type: mongoose.SchemaTypes.String,
    },
    wrong: {
        type: mongoose.SchemaTypes.String,
    },
    answer: {
        type: mongoose.SchemaTypes.String,
    },
});

module.exports = mongoose.model('chinanew', chinanew);
