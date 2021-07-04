const mongoose = require("mongoose");

const DiscordAccount = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
    discriminator: { type: String, required: true },
    date: { type: Date, require: true, default: Date.now },
});

module.exports = mongoose.model("discord_accounts", DiscordAccount);
