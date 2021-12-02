/**
 * User boolean accessible in views if authenticated
 * To know if someone has logged in or not
 * This lets us be able to display either login or logout links depending if someone is logged in or out.
 * @param {*} req the browser request
 * @param {*} res the server response
 * @param {function} next next function
 */
module.exports = (req, res, next) => {
    res.locals.isUserAuthenticated = req.isAuthenticated()
    if(req.isAuthenticated()) {
        res.locals.userid = req.user.user_id;
    }
    next()
}