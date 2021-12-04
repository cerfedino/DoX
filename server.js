const config = require('./config/config.js')
const app = require("./app.js")


require('greenlock-express').init({
    packageRoot: __dirname,
    configDir: "./greenlock.d/config.json",
    // contact for security and critical bug notices
    maintainerEmail: config.ssl.email,
    // whether or not to run at cloudscale
    cluster: false
}) .ready(httpsWorker);

function httpsWorker(glx) {
    //
    // HTTP can only be used for ACME HTTP-01 Challenges
    // (and it is not required for DNS-01 challenges)
    //
    // Get the raw http server:
    var httpServer = glx.httpServer(function(req, res) {
        res.statusCode = 301;
        res.setHeader("Location", "https://" + req.headers.host + req.path);
        res.end("Insecure connections are not allowed. Redirecting...");
    });

    httpServer.listen(config.webserver.port, "0.0.0.0", function() {
        console.info("Listening on ", httpServer.address());
    });
}