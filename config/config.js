/** 
 * 
 * Contains all the application settings and/or parameters.
 * 
*/
// const fs = require('fs-extra')
// const path = require('path')
const rate_limit = require("express-rate-limit");

// CL argument. Expected to be "local" or "remote" or undefined
const arg = process.argv[2]

///////////////////
// Initializes some settings that depend on whether the application is getting deployed locally or remotely
const PORT = (arg !== "remote") ?  8888       : process.env.PORT
const HOST = (arg !== "remote") ? "localhost" : process.env.HOST
const HTTPS_ENABLED = (arg !== "remote") ? false : true

const MONGODB_URI = (arg !== "remote") ? `mongodb://localhost:27017` : process.env.MONGODB_URI


const MAILSEVER_USER      = (arg !== "remote") ? "" : process.env.MAILSERVER_USER
const MAILSERVER_PASSWORD = (arg !== "remote") ? "" : process.env.MAILSERVER_PASSWORD

const SSL_EMAIL = (arg !== "remote") ? "" : process.env.SSL_EMAIL
///////////////////

const settings = {
    webserver: {
        remote: (arg === "remote"),
        https_enabled: HTTPS_ENABLED,
        domain: HOST,
        port: PORT,

        rate : {
            login_register_limiter:
                new rate_limit({
                    windowMs: 1000, // 1 second
                    max: 1,         // max requests in 'windowMs' before blocking
                    message: "Too many auth submissions, slow down."
                }),
            generic_limiter:
                new rate_limit({
                    windowMs: 2000,
                    max: 1000,
                    message: "This IP is sending too many requests, slow down."
                })
        }
    },

    cookie : {
        name: "DoXCookie",
        expires: new Date(Date.now() + 1000*60*60* 24*7)   // Cookie expires after 7 days
    },

    database: {
        mongodb_uri: MONGODB_URI,
        db_name: "DoX_db",
        collections: ["users", "docs"],

        max_users_per_email : 10
    },

    mailing: {
        user: MAILSEVER_USER,           // Mailer address
        pass: MAILSERVER_PASSWORD,      // Application token (prevents from logging in through browser)

        verification_link_expiry : 1000*60*60*24,    // Confirmation links expire in 24 hours
        verification_links_check : 1000*60*10        // Mailing checks for expired confirmation links every 10 minutes
    },

    ssl: {
        // Get updates if SSL certificate is expiring ecc.
        email: SSL_EMAIL
    }

}

// Deep freezes the settings object.
const deepFreeze = obj => {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
    });
    return Object.freeze(obj);
};


// if(arg === "remote") {
//     fs.writeFileSync(path.resolve(__dirname,"./greenlock.d/config.json"),
// `{ "sites": 
//     [
//         { 
//             "subject": "${settings.webserver.domain}", 
//             "altnames": [ "www.${settings.webserver.domain}" ] 
//         }
//     ] 
// }`)

// }

module.exports = deepFreeze(settings)
