const mongoose = require("mongoose");

const cooldown = new mongoose.Schema({
  discordid: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  stamp: {
    type: mongoose.SchemaTypes.Number
  },
  robstamp: {
    type: mongoose.SchemaTypes.Number
  },
  buttonstamp: {
    type: mongoose.SchemaTypes.Number
  },
  selectstamp: {
    type: mongoose.SchemaTypes.Number
  }
});

module.exports = mongoose.model('cooldown', cooldown);