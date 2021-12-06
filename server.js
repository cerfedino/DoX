const config = require('./config/config.js')
const app = require("./app.js")
const https = require("https");
const fs = require('fs-extra')



if(process.argv[2] == "remote") {
    // const key = fs.readFileSync("localhost-key.pem", "utf-8");
    // const cert = fs.readFileSync("localhost.pem", "utf-8");
    // https.createServer({ key, cert }, app).listen(config.webserver.port);

    // TODO: Add HTTPS encryption if remote.
    https.createServer(app).listen(config.webserver.port)
} else {
    https.createServer(app).listen(config.webserver.port)
}