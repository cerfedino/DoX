/**
 * Middleware that lets views access some useful informations
 *      <% isUserAuthenticated %>   a boolean to check if user is authenticated
 *      <% userid %>                a string representing the user ID
 *      <% messageSuccess | '' %>        a string containing the success message 
 *      <% messageFailure | '' %>        a string containing the failure message
 * 
 * @param {*} req the browser request
 * @param {*} res the server response
 * @param {function} next next function
 */
module.exports = (req, res, next) => {
    res.locals.isUserAuthenticated = req.isAuthenticated()
    if(req.isAuthenticated()) {
        res.locals.userid = req.user.user_id;
    }
    res.locals.messageSuccess = req.flash('messageSuccess')
    res.locals.messageFailure = req.flash('messageFailure')

    next()
}