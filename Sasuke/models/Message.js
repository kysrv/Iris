const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  content: { type: String, required: true },
  date: { type: Date, require: true, default: Date.now },
});

module.exports = mongoose.model("messages", messageSchema);
