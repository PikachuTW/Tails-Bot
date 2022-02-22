const mongoose = require("mongoose");

const totem = new mongoose.Schema({
  discordid: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  rank: {
    type: mongoose.SchemaTypes.Number,
    required: true
  },
  cooldownReduce: {
    type: mongoose.SchemaTypes.Number,
    required: true
  },
  investMulti: {
    type: mongoose.SchemaTypes.Number,
    required: true
  },
  commandCost: {
    type: mongoose.SchemaTypes.Number,
    required: true
  },
  giveTax: {
    type: mongoose.SchemaTypes.Number,
    required: true
  },
  doubleChance: {
    type: mongoose.SchemaTypes.Number,
    required: true
  }
});

module.exports = mongoose.model('totem', totem);