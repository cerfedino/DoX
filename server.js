const config = require('./config/config.js')
const app = require("./app.js")

const websocket = require("./modules/socket.js")

const server = require('http').createServer(app);
websocket.init(server)
server.listen(config.webserver.port);