// database
const models = require('../models').model;

const auth = require('./auth.js');
const dbops = require('./dbops.js');


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
        // If password valid call done and serialize user.id to req.user property
        if (passwordValid) {
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
    let registered_user = await dbops.find_user(filter)
    // Return false if user already exists - failureRedirect
    if (registered_user) {
        return done(null,
            false,
            {
                status: 'fail',
                message: 'Username already taken'
            });
    }
    // Create new user and return the user - successRedirect
    let new_user = await dbops.create_user(
        user,
        req.body.email,
        password
    )
    return done(null,
        { 
            user_id: new_user._id
        },{
            status: 'neutral',
            message: 'Check your email for confirmation'
        })
}



module.exports = { authUser, registerUser }