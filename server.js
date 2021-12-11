const config = require('./config/config.js')
const app = require("./app.js")
// const fs = require('fs-extra')

const websocket = require("./modules/socket.js")


if(config.webserver.https_enabled) {
    // const key = fs.readFileSync("localhost-key.pem", "utf-8");
    // const cert = fs.readFileSync("localhost.pem", "utf-8");
    // https.createServer({ key, cert }, app).listen(config.webserver.port);

    // TODO: Add HTTPS encryption if remote.
    const server = require('http').createServer(app);
    websocket.init(server)
    server.listen(config.webserver.port);
} else {
    const server = require('http').createServer(app);
    websocket.init(server)
    server.listen(config.webserver.port);
}