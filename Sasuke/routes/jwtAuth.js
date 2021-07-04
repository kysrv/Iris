const { logSuspiciousRequest } = require("../Utils.js/logs");
const jwt = require("jsonwebtoken");

const jwtAuth = (req, res, next) => {
  try {

    if (!req.headers["authorization"])
      return res.json({ error: "invalid auth header" })

    const authHeader = req.headers["authorization"];

    // on le veut de la forme "x <token>""
    if (authHeader.split(" ").length != 2)
      return res.json({ error: "invalid auth header" });

    const token = authHeader.split(" ")[1];

    if (token == undefined) return res.json({ error: "invalid auth token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded._id;
    if (next) {
      next()
      return; // sinon boom 
    };
    // * pour le serveur websocket
    return res.json({ userId: req.userId })

  } catch (error) {
    if (error.message == "invalid signature") {
      const msg = "323-1 à 323-7 ->";

      logSuspiciousRequest(req);
      return res.json({ error: msg + `(${req.ip})` });
    }
    return res.json({ error: error.toString() });
  }
};

module.exports = { jwtAuth };
