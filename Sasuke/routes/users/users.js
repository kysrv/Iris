const express = require("express");
const User = require("../../models/User");
const { logSuspiciousRequest } = require("../../Utils.js/logs");
const { jwtAuth } = require("../jwtAuth");

const router = express.Router();

mapUserToPublic = (user) => { };

router.use(jwtAuth);

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select(
      "username accountCreationDate pp _id channels"
    );
    res.json(users);
  } catch (err) {
    res.json(err);
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (userId == "@me") {
    const user = await User.findById(req.userId).select([
      "username",
      "pp",
      "_id",
      "email",
      "accountCreationDate",
    ]);
    // * si on ne toruve pas d'user avec cette id
    if (user == null) {
      logSuspiciousRequest(req);
      return res.json({ error: "Invalid user id" });
    }

    res.json(user.toObject());
  } else {
    res.json("under dev");
  }
  // try {
  //   const users = await User.find();
  //   const filtered = users.map(({ username, email, accountCreationDate }) => {
  //     username, email, accountCreationDate;
  //   });
  //   res.json(filtered);
  // } catch (err) {
  //   res.json(err);
  // }
});

// faire avec des paramètres pour la recherche

module.exports = router;
