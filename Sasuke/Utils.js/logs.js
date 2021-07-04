const Log = require("../models/Log");

function logSuspiciousRequest(req) {
  const { headers, body, ip } = req;
  const log = new Log({ info: { headers, body, ip } });
  log.save();
}

module.exports = { logSuspiciousRequest };
