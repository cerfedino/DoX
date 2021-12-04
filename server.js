const config = require('./config/config.js')
const app = require("./app.js")

require('greenlock-express').init({
    packageRoot: __dirname,
    configDir: "./config/greenlock.d/",
    // contact for security and critical bug notices
    maintainerEmail: config.ssl.email,
    // whether or not to run at cloudscale
    cluster: false
}) .ready(httpsWorker);

function httpsWorker(glx) {
    //
    // HTTPS 1.1 is the default
    // (HTTP2 would be the default but... https://github.com/expressjs/express/issues/3388)
    //
    // Get the raw https server:
    var httpsServer = glx.httpsServer(null, function(req, res) {
        res.end("Hello, Encrypted World!");
    });

    httpsServer.listen(443, "0.0.0.0", function() {
        console.info("Listening on ", httpsServer.address());
    });

    // Note:
    // You must ALSO listen on port 80 for ACME HTTP-01 Challenges
    // (the ACME and http->https middleware are loaded by glx.httpServer)
    var httpServer = glx.httpServer();

    httpServer.listen(config.webserver.PORT, "0.0.0.0", function() {
        console.info("Listening on ", httpServer.address());
    });
}