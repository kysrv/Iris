const path = require("path");
const fs = require("fs");

const express = require("express");
const cors = require("cors");

require("dotenv").config();
const app = express();


// * * * Création du serveur HTTP * * * //
const { HTTPS_PORT, HTTP_PORT } = process.env;

let server;
let port;



try {
  // * création du serveur HTTPS

  let options = { key: fs.readFileSync('ssl/privkey.pem'), cert: fs.readFileSync('ssl/fullchain.pem') }

  server = require('https').createServer(options, app)
  port = HTTPS_PORT;

  // * redirige tout le trafique en https
  const redirector = express().all("*", (req, res) => res.redirect(`https://${req.hostname}${req.url != "/" ? req.url : ""}:${HTTPS_PORT != 443 ? HTTPS_PORT : ""}`));
  httpsRedirectServer = require("http").createServer(redirector)
  httpsRedirectServer.listen(HTTP_PORT, /*() => console.log("redirect server started")*/)

} catch {
  // * serveur HTTP si pas de certificat ssl
  server = require("http").createServer(app);
  port = HTTP_PORT;
}


// * * * MIDLEWARES * * * //
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Embedder-Policy", "*");
  res.header("Referrer-Policy", "no-referrer");
  next();
})

// * * * ROUTES * * * //

// * API
app.use("/api", require("./routes/api"));

// * React app
app.use("/", express.static("./../Batman/build"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "./../Batman/build/index.html"));
});

module.exports = { HTTPServer: server, port }