const mongoose = require("mongoose");

const log = mongoose.Schema({
  info: { type: mongoose.Mixed, required: true },
  date: { type: Date, require: true, default: Date.now },
});

module.exports = mongoose.model("logs", log);
