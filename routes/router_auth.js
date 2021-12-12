/**
 * Web Atelier 2021  Final Project : DoX
 *
 * /auth API router
 *
 * Provides authentication-related routes. 
 * 
 */


 const express = require('express');
 const router = express.Router();
 
 const dbops = require('../modules/dbops.js')
 const {ObjectId} = require("mongodb");
 
 const passport = require('passport');
 
 
 module.exports = router;


// ###############
// GET REQUESTS
// ###############

/*
    GET /auth/verify/:id/:token
    Check the link sent by email to the user
    if id not valid : 404 (searching into db will crash the server)
    if user not found : 404
    If user is valid and token matches: redirect to login page and allow user authentication
    if token not valid : 401
 */
router.get('/verify/:id/:token', async function(req, res) {

    if (!ObjectId.isValid(req.params.id)) {
        if(req.accepts("text/html")) {
            res.status(404).render('../views/error.ejs', {s: 404, m: `Invalid user ID. Check if there is a typo in: ${req.url}`});
        } else {
            res.status(404).send(`Invalid user ID. Check if there is a typo in: ${req.url}`).end();
        }
        return
    }

    let user = await dbops.user_find({_id : ObjectId(req.params.id)});
    if (!user) { // this case should not happen (only if the user manually modify the link)
        if(req.accepts("text/html")) {
            res.status(404).render('../views/error.ejs', {s: 404, m: `Invalid user ID. Check if there is a typo in: ${req.url}`});
        } else {
            res.status(404).send(`Invalid user ID. Check if there is a typo in: ${req.url}`).end();
        }
        return
    }

    if (user.token == req.params.token) {
        dbops.user_set_email_verification(ObjectId(user._id)).then( () => {
            
            req.flash('messageSuccess', 'Email verified!')
            res.redirect('/login');
        })
    } else {
        if(req.accepts('text/html')) {
            res.status(401).render('../views/error.ejs', {s: 401, m: `Token does not match. Check if there is a typo in: ${req.url}`});
        } else {
            res.status(401).send(`Token does not match. Check if there is a typo in: ${req.url}`).end();
        }
        
    }
})




// ###############
// POST REQUESTS
// ###############

/*
    POST /auth/login
    Authenticates a user with credentials
 */
router.post("/login", function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info ) {
        if (err) { return next(err); }
        
        if (info.status == 'fail') { return res.status(401).json(info); }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.flash('messageSuccess', 'Successfully logged in')
            res.status(200).json(info);
        });
    })(req, res, next);
});

/*
    POST /auth/register
    Registers a new user
*/
router.post("/register",  function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info ) {
        if (err) { return next(err); }
        
        if (info.status == 'fail') { return res.status(401).json(info); }

        // do not log in user (email verification is needed)
        // req.logIn(user, function(err) {
        //     if (err) { return next(err); }
        req.flash('messageSuccess', 'Successfully registered')
        res.status(200).json(info);
        // });
    })(req, res, next);
});

// ###############
// DELETE REQUESTS
// ###############

/*
    DELETE /auth/logout
    Log-out user
*/
router.delete("/logout", (req,res) => {
    req.logOut();
    req.flash('messageSuccess', 'Successfully logged out');
    res.redirect('/login');
})