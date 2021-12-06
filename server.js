const config = require('./config/config.js')
const app = require("./app.js")
const https = require("https");
const fs = require('fs-extra')



if(config.webserver.https_enabled) {
    // const key = fs.readFileSync("localhost-key.pem", "utf-8");
    // const cert = fs.readFileSync("localhost.pem", "utf-8");
    // https.createServer({ key, cert }, app).listen(config.webserver.port);

    // TODO: Add HTTPS encryption if remote.
    app.listen(config.webserver.port)
} else {
    app.listen(config.webserver.port)
}