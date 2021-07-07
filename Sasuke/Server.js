
const { HTTPServer, port } = require("./HTTPServer")
const { WebSocketServer, handleNewWebSocketConnection } = require("./WebSocketServer")

const mongoose = require("mongoose");
const Channel = require("./models/Channel");
const User = require("./models/User");


process.on('uncaughtException', err => {
    console.error('There was an uncaught error', err)
})
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

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

    // console.log(JSON.stringify(document, null, 4))
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


User.watch().on("change", async document => {
    console.log(JSON.stringify(document, null, 4))
    // * seuls champs sur lequels on doit envoyer un event userUpdate
    const validFields = "username pp accountCreationDate status bio".split()

    // WebSocketServer.clients.forEach(client => {
    //     console.log(`<${client.userId}> - sended`)
    // })

    // console.log(JSON.stringify(document, null, 4))
    if (document.operationType == "update" || document.operationType == "insert") {

        // * => si aucun des champs listé au dessus n'a été modifié
        if (document.operationType != "insert") {
            // document.updateDescription.updatedFields n'existe pas lors des updates
            if (Object.keys(document.updateDescription.updatedFields).filter(key => validFields.includes(key)).lenght == 0) {
                return
            }
        }
        const user = await User.findById(document.documentKey._id).select("_id username pp accountCreateDate");

        // * futur: pour chacun de ses amis
        WebSocketServer.clients
            .forEach(client => {
                const event = document.operationType == "update" ? "userUpdate" : "newUser";

                client.json({ event, user })

            })
    }

})





