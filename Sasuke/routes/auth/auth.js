const express = require("express");
const User = require("../../models/User");

require("dotenv").config(); // * pour le JWT_SECRET
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user != null) {
    return res.json({ error: "Email already in use" });
  } else {
    try {
      const newUser = new User({
        username,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
      });

      await newUser.save();
      res.json(newUser);
    } catch (err) {
      res.json({ error: err.toString() });
    }
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (user == null) return res.json({ error: "Invalid credentials" });
    user = user.toObject();

    const validCredential = bcrypt.compareSync(password, user.password);

    if (validCredential) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.json({ token });
    } else {
      res.json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.json({ error: err.toString() });
  }
});

module.exports = router;
