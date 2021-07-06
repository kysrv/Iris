const mongoose = require("mongoose");

const genAuthToken = "";

const user = mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  pp: {
    type: String,
    required: true,
    default:
      "https://cdn.discordapp.com/attachments/776612332507496460/814501012646658099/sasuke.jpg",
  },
  accountCreationDate: { type: Date, require: true, default: Date.now },
  channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "channels" }],
  // status: { type: String, required: true, default: "offline" },
  // bio: { type: String, required: true, default: "" },
});



module.exports = mongoose.model("users", user);
