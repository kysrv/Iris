const WebSocket = require("ws");

const User = require("./models/User");

const { jwtAuth } = require("./routes/jwtAuth");



const server = new WebSocket.Server({ noServer: true });

// const usersSockets = new Map()
server.on('connection', async (socket) => {
    // * socket.io en sueur
    socket.json = (data) => {
        socket.send(JSON.stringify(data));
    }
    socket.on("message", (msg) => {
        socket.emit("msg", JSON.parse(msg))
    })



    let user = await User.findById(socket.userId);
    // socket.userDocument = user;

    console.log(`[ws] - new client < ${user.username}> connected`)

    socket.json({ "msg": "salut" })

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



    socket.on("close", (ws, code, reason) => {
        console.log(`[ws] - close: <${user.username}> disconnected ([${code}: ${reason}])`)
    })

    socket.on("error", (ws, cod, reason) => {
        console.log(`[ws] - error: <${user.username}> disconnected ([${code}: ${reason}])`)
    })
})


server.on("error", (error) => console.error(error))

const handleNewWebSocketConnection = (req, socket, head) => {
    let res;
    try {
        // * on triche pour se reservir d'un middleware fait pour express
        res = JSON.parse(jwtAuth({ headers: { authorization: "User " + req.url.substr(1) } }, { json: JSON.stringify }))
        if (res.error) {
            throw new Error(res.error)
        }
    } catch (error) {
        console.error(error)
        socket.write(`HTTP / 1.1 401 Unauthorized(${JSON.stringify(error)}) \r\n\r\n`)
        return
    }



    server.handleUpgrade(req, socket, head, (socket) => {
        socket.userId = res.userId;
        server.emit("connection", socket)
    })
}

module.exports = { WebSocketServer: server, handleNewWebSocketConnection }