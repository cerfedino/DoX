// database
const models = require('../models').model;

const auth = require('./auth.js');
const dbops = require('./dbops.js');


/**
 * Search the user, password in the DB to authenticate the user
 * @param {String} user  the username to authenticate
 * @param {String} password  the password 
 * @param {function(<err>, <user>)} done the function to return
 * @returns {done(<err>, <user>)}
 */
async function authUser(user, password, done) {
    const filter = {username : user}
    models.users.findOne(filter).then(registered_user => {
        authenticated_user = false;
        let passwordValid = registered_user && auth.check_pwd(password, registered_user.password) 
        
        // If password valid call done and serialize user.id to req.user property
        if (passwordValid) {
            return done(null, { user_id: registered_user._id })
        }
        // If invalid call done with false and flash message
        return done(null, false, {
            type: 'messageFailure',
            message: 'Invalid username and/or password'
        });
    })
}



/**
 * To register a new user
 * @param {Object} req the browser request
 * @param {String} user the username of the new user
 * @param {String} password the  
 * @param {function(<err>, <user>)} done the function to return
 * @returns {done(<err>, <user>)}
 */
async function registerUser(req, user, password, done) {
    
    const filter = {username : user}
    let registered_user = await models.users.findOne(filter)//.then(registered_user => {
    // Return false if user already exists - failureRedirect
    if (registered_user) { 
        return done(null, false, {
            type: 'messageFailure',
            message: 'Username already taken'
        })}
    // Create new user and return the user - successRedirect
    let new_user = await dbops.create_user(
        user,
        req.body.email,
        password
    )
    return done(null, {user_id: new_user._id})
}



module.exports = {authUser, registerUser}