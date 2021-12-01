/**
 * Web Atelier 2021  Final Project : DoX
 *
 * / API router
 *
 */

const express = require('express');
const path = require("path");
const router = express.Router();

module.exports = router;


////////////////

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect("/login")
}

function checkLoggedIn(req, res, next) {
    // if (req.isAuthenticated()) {
    //      return res.redirect("/docs")
    // }
    next()
}

// ###############
// GET REQUESTS
// ###############

/*
    GET /
    If authentication is succesfull, redirects to the documents view.
        Otherwise, redirects to the GET /login
 */
router.get('/', function (req, res) {
    //TODO: Implement auth

    res.redirect("/login")
})

/*
    GET /login
    Renders the login form.
 */
router.get('/login',checkLoggedIn,  function (req, res) {
    if (req.accepts("text/html")) {
        res.render('../views/login.ejs', {});
    } else {
        res.status(406).end();
    }
})

/*
    GET /register
    Renders the register form.
 */
router.get('/register', function (req, res) {
    if (req.accepts("text/html")) {
        res.render("../views/register.ejs")
    } else {
        res.status(406).end();
    }
})

/*
    GET /docs/:id
    Renders the document edit view for the specified document.
    IF the user only has read access to it, renders accordingly.
        IF the user has NO access to it, denies access to it.
 */
router.get('/docs/:id?', checkAuthenticated, function (req, res) {
    if(req.params.id) {
        // TODO: Check if user is allowed to view/edit document
        res.render('../views/edit.ejs')
    } else {
        res.render('../views/documents.ejs')
    }

})


// ###############
// POST REQUESTS
// ###############

/*
    POST /auth
    Authenticates a user with credentials
    'local' signifies that we are using ‘local’ strategy.
 */
const passport = require('passport');



router.post("/auth", passport.authenticate('local-login', {
    successRedirect: "/docs",
    failureRedirect: "/login",
    failureFlash: {
        type: 'messageFailure',
        message: 'Invalid username and/or password.'
    },
    successFlash: {
        type: 'messageSuccess',
        message: 'Successfully logged in.'
    }
}))

/*
    POST /auth/register
    Registers a new user
 */
router.post("/auth/register", passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash: {
        type: 'messageFailure',
        message: 'Username already taken.'
    },
    successFlash: {
        type: 'messageSuccess',
        message: 'Successfully signed up.'
    }
}))


/*
    DELETE /logout
    Log-out user
 */
router.delete("/logout", (req,res) => {
    req.logOut()
    req.flash('messageSuccess', 'Successfully logged out')
    res.redirect("/login")
})