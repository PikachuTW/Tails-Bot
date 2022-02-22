const mongoose = require("mongoose");

const warning = new mongoose.Schema({
  discordid: {
    type:mongoose.SchemaTypes.String,
    required: true
  },
  warnstamp: {
    type:mongoose.SchemaTypes.Number,
    required: true
  },
  warncontent: {
    type:mongoose.SchemaTypes.String,
    required: true
  },
  warnstaff: {
    type:mongoose.SchemaTypes.String,
    required: true
  }
});

module.exports = mongoose.model('warning', warning);