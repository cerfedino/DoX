/**
 * Success and failure flash message in views
 * We store the success and failure flash messages in the global res.locals property
 * This makes it accessible in all our views via <%= messageSuccess %> and <%= messageFailure %>.
 * @param {*} req the browser request
 * @param {*} res the server response
 * @param {function} next next function
 */
module.exports = (req, res, next) => {
    res.locals.messageSuccess = req.flash('messageSuccess')
    res.locals.messageFailure = req.flash('messageFailure')
    next();
}