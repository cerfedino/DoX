/** 
 * 
 * Contains all the application settings and/or parameters.
 * 
*/
const url = require('url')

///////////////////
const PORT = process.env.PORT || 8888
const HOST = process.env.HOST || "localhost"
///////////////////

const settings = {
    webserver : {
        domain: HOST,
        port: PORT
    },

    database : {
        mongodb_uri : "mongodb+srv://doxdatabase:a0ouQ1k2jPbaeYvOyvdR@doxeditor.0rima.mongodb.net/test",
        db_name     : "DoX_db",
        collections : ["users","docs"]
    },

    mailing : {
        user: 'noreply.mailserver.dox@gmail.com',   // Mailer address
        pass: 'srcaszbhkohfmlnn'                    // Application password (prevents from logging in through browser)
    }

}

const deepFreeze = obj => {
    Object.keys(obj).forEach(prop => {
      if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
    });
    return Object.freeze(obj);
  };
deepFreeze(settings);

module.exports = settings
