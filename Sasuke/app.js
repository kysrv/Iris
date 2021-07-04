const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const WebSocket = require("ws");
const { jwtAuth } = require("./routes/jwtAuth");
const User = require("./models/User");
const { update } = require("./models/User");
const Channel = require("./models/Channel");
const fs = require("fs");
require("dotenv").config();
const app = express();

let server;
try {
  // * clef & certificat pour le https
  let options = { key: fs.readFileSync('ssl/privkey.pem'), cert: fs.readFileSync('ssl/fullchain.pem') };
  server = require('https').createServer(options, app)
} catch {
  server = require("http").createServer(app);
}



const ws = new WebSocket.Server({ noServer: true });

// const usersSockets = new Map()
ws.on('connection', async (socket) => {
  socket.json = (data) => {
    socket.send(JSON.stringify(data));
  }
  socket.on("message", (msg) => {
    socket.emit("msg", JSON.parse(msg))
  })



  let user = await User.findById(socket.userId);
  // socket.userDocument = user;

  console.log(`[ws] - new client <${user.username}> connected`)

  socket.json("salut")

  socket.on("msg", async msg => {
    const { request, content } = msg;

    if (request == "rename") {
      if (content) {
        await user.updateOne({ username: content })
      }
    } else if (request == "msg") {
      console.log(content)
    }
  })



})



// * * * MIDLEWARES * * * //
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Embedder-Policy", "")
  res.header("Referrer-Policy", "no-referrer");
  next();
})
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


// * * * ROUTES * * * //
app.use("/", express.static("./../Batman/build"));
app.use("/api", require("./routes/api"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "./../Batman/build/index.html"));
});

// * * * connection à la db * * * //
mongoose.connect(
  process.env.DB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connected to database");

    }
  }
);

// lancement du serveur
const { PORT } = process.env;
server.listen(PORT, () => {
  console.log(`Iris started on 127.0.0.1:${PORT}`);

  // * /!\ j'envoie tout le channel c'est pas opti /!\
  Channel.watch(/*[], { fullDocument: "updateLookup" }*/).on("change", async (data) => {

    // console.log(JSON.stringify(data, null, 4))
    const channel = await Channel.findById(data.documentKey._id).populate([
      {
        path: "members",
        select: "_id username pp"
      },
      {
        path: "messages",
        populate: { path: "author", select: "_id username pp" }
      }]
    );

    const validMembersIds = channel.members.map(m => m._id)
    ws.clients
      .forEach(client => {

        if (validMembersIds.includes(client.userId)) {
          client.json({ event: "channelUpdate", channel })
        }
      })

  })

});




// * requête pour crée un session websocket
server.on('upgrade', (req, socket, head) => {
  let res;
  try {
    // * on triche pour se reservir d'un middleware fait pour express
    res = JSON.parse(jwtAuth({ headers: { authorization: "User " + req.url.substr(1) } }, { json: JSON.stringify }))
    if (res.error) {
      throw new Error(res.error)
    }
  } catch (error) {
    console.error(error)
    socket.write(`HTTP/1.1 401 Unauthorized  (${JSON.stringify(error)}) \r\n\r\n`)
    return
  }



  ws.handleUpgrade(req, socket, head, (socket) => {
    socket.userId = res.userId;
    ws.emit("connection", socket)
  })
})
