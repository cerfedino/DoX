// database
const models = require('../models').model;

const auth = require('./auth.js');
const dbops = require('./dbops.js');
const mailing = require('./mailing.js');
const config = require('../config/config.js');

/**
 * Search the user, password in the DB to authenticate the user
 * @param {String} user  the username to authenticate
 * @param {String} password  the password 
 * @param {function(<err>, <user>, <info>)} done the function to return
 * @returns {done(<err>, <user>, <info>)}
 */
async function authUser(user, password, done) {
    const filter = { username: user }

    models.users.findOne(filter).then(registered_user => {

        if (!registered_user) {
            return done(null,
                false,
                {
                    status: 'fail',
                    message: 'Invalid username'
                });
        }
        
        let passwordValid = registered_user && auth.check_pwd(password, registered_user.password)

        if(registered_user && !registered_user.email_verification_status) {
            return done(null,
                false,
                {
                    status: 'fail',
                    message: 'Verify your email first'
                });
        } else if (passwordValid) { // If password valid call done and serialize user.id to req.user property
            return done(null,
                {
                    user_id: registered_user._id
                },
                {
                    status: 'success',
                    message: 'Successfully logged in'
                })
        }
        // If invalid call done with false and flash message
        return done(null,
            false,
            {
                status: 'fail',
                message: 'Wrong password'
            });
    })
}


/**
 * To register a new user
 * @param {Object} req the browser request
 * @param {String} user the username of the new user
 * @param {String} password the  
 * @param {function(<err>, <user>, <info>)} done the function to return
 * @returns {done(<err>, <user>, <info>)}
 */
async function registerUser(req, user, password, done) {
    const filter = { username: user }
    let registered_user = await dbops.user_find(filter)
    // Return false if user already exists - failureRedirect
    if (registered_user) {
        return done(null,
            false,
            {
                status: 'fail',
                message: 'Username already taken'
            });
    }
    // Create new user and return the user

    let user_token = generate_random_token();

    let new_user = await dbops.user_create(
        user,
        req.body.email,
        password,
        user_token
    )

    let verification_link = `http://${config.webserver.domain}:${config.webserver.port}/auth/verify/${new_user._id}/${new_user.token}`
    // send email with verification link
    mailing.send_mail(user, req.body.email, verification_link)


    return done(null,
        false,   // still do not authorize user { user_id: new_user._id }
        {
            status: 'neutral',
            message: 'Check your email for confirmation'
        })
}

// to generate a random token used to check email
function generate_random_token() {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
};

module.exports = { authUser, registerUser }