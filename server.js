const config = require('./config/config.js')
const server = require("./app.js")
const https = require("https");
const fs = require('fs-extra')



if(config.webserver.https_enabled) {
    // const key = fs.readFileSync("localhost-key.pem", "utf-8");
    // const cert = fs.readFileSync("localhost.pem", "utf-8");
    // https.createServer({ key, cert }, app).listen(config.webserver.port);

    // TODO: Add HTTPS encryption if remote.
    server.listen(config.webserver.port)
} else {
    server.listen(config.webserver.port)
}