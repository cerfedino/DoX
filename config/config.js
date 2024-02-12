/** 
 * 
 * Contains all the application settings and/or parameters.
 * 
*/
// const fs = require('fs-extra')
// const path = require('path')
const rate_limit = require("express-rate-limit");

///////////////////
// Reads env vars
const LISTEN_PORT = process.env.LISTEN_PORT
const ENDPOINT_URL = process.env.ENDPOINT_URL

const MONGODB_URI = process.env.MONGODB_URI

const MAILSERVER_SENDER_ADDRESS = process.env.MAILSERVER_SENDER_ADDRESS
const MAILSERVER_HOST = process.env.MAILSERVER_HOST
const MAILSERVER_PORT = process.env.MAILSERVER_PORT
const MAILSERVER_USER = process.env.MAILSERVER_USER
const MAILSERVER_PASSWORD = process.env.MAILSERVER_PASSWORD
///////////////////

const settings = {
    webserver: {
        listen_port: LISTEN_PORT,
        endpoint_url: ENDPOINT_URL,

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
        user: MAILSERVER_USER,           // Mailer address
        pass: MAILSERVER_PASSWORD,      // Application token (prevents from logging in through browser)
        host: MAILSERVER_HOST,
        port: MAILSERVER_PORT,
        sender: MAILSERVER_SENDER_ADDRESS,

        verification_link_expiry : 1000*60*60*24,    // Confirmation links expire in 24 hours
        verification_links_check : 1000*60*10        // Mailing checks for expired confirmation links every 10 minutes
    },
}

// Deep freezes the settings object.
const deepFreeze = obj => {
    Object.keys(obj).forEach(prop => {
        if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
    });
    return Object.freeze(obj);
};

module.exports = deepFreeze(settings)
