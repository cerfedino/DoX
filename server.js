const config = require('./config/config.js')
const app = require("./app.js")


require('greenlock-express').init({
    packageRoot: __dirname,
    configDir: "./config/greenlock.d",

    approveDomains : [config.webserver.domain, `www.${config.webserver.domain}`],

    // contact for security and critical bug notices
    maintainerEmail:  config.ssl.email,

    // whether or not to run at cloudscale
    cluster: false
})
    // Serves on 80 and 443
    // Get's SSL certificates magically!
    .serve();

//     .create({
//
//     version: 'draft-11',
//     server: 'https://acme-v02.api.letsencrypt.org/directory',
//
//     email: config.ssl.email,
//     agreeTOS: true,
//     configDir: "",
//
//     app: app,
//
//     communityMember: false,
//     telemetry: false
//
// }).listen(app.get('port'))