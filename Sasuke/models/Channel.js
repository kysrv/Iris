const mongoose = require("mongoose");

const channelSchema = mongoose.Schema({
  name: { type: String, require: true, default: "a group" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messages" }],
  isPublic: {
    type: mongoose.Schema.Types.Boolean,
    require: true,
    default: false,
  },
  date: { type: Date, require: true, default: Date.now },
});

module.exports = mongoose.model("channels", channelSchema);
