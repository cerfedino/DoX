const {model} = require("../models/")
const dbops = require("./dbops.js")

// Hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;
//
function encrypt_pwd(pwd) {
    return bcrypt.hash(pwd, saltRounds)
}
function check_pwd(pwd,hash) {
    return bcrypt.compare(pwd,hash)
}

/**
 * Authenticates a user.
 * @param {String} user_id the user to authenticate.
 * @param hash the hashed password.
 * @returns {Promise<boolean>} whether the user has been successfully authenticated or not.
 */
function auth_usr(user_id, hash) {
    return new Promise(async (resolve)=>{
        const user = await dbops.get_user({_id:user_id})
        return user.password == hash
        // To be continued
    })
}


module.exports = {encrypt_pwd, check_pwd, auth_usr}