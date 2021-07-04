const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.use("/channels", require("./channels/channels"));
router.use("/users", require("./users/users"));
router.use("/tools/", require("./tools/tools"));



router.use("/auth", require("./auth/auth"));

module.exports = router;
