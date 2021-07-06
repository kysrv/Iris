
const { HTTPServer, port } = require("./HTTPServer")
const { WebSocketServer, handleNewWebSocketConnection } = require("./WebSocketServer")

const mongoose = require("mongoose");
const Channel = require("./models/Channel");
const User = require("./models/User");

// * connection à la db
mongoose.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => console.log(!err ? "Connected to database" : "Failed to connect to database")
);

// * connection au serveur websocket
HTTPServer.on('upgrade', handleNewWebSocketConnection)

HTTPServer.listen(port, () => console.log(`Iris started on 127.0.0.1:${port}`));






// * mise à jour des données en temps réel
// note: Channel.watch([], { fullDocument: "updateLookup" })
Channel.watch().on("change", async document => {

    console.log(JSON.stringify(document, null, 4))
    if (document.operationType == "update" || document.operationType == "insert") {
        const channel = await Channel.findById(document.documentKey._id).populate([
            {
                path: "members",
                select: "_id username pp"
            },
            {
                path: "messages",
                populate: { path: "author", select: "_id username pp" }
            }]
        );

        const channelMembersIds = channel.members.map(m => m._id)
        WebSocketServer.clients
            .forEach(client => {

                if (channelMembersIds.includes(client.userId)) {
                    const event = document.operationType == "update" ? "channelUpdate" : "newChannel";
                    client.json({ event, channel })
                }
            })
    }

})


// User.watch().on("change", doc => console.log(doc))



