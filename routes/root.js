/**
 * Web Atelier 2021  Final Project : DoX
 *
 * / API router
 *
 */

const express = require('express');
const router = express.Router();

const dbops = require('../modules/dbops.js')
const {ObjectId} = require("mongodb");

const passport = require('passport');


module.exports = router;


////////////////

/*
    Middleware to check if the user is authenticated 
 */
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next() }
    res.redirect("/login")
}

/*
    Middleware to check if the user is already logged in
 */
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/docs")
    }
    next()
}

// ###############
// GET REQUESTS
// ###############


/*
    GET /login
    Renders the login form.
 */
router.get('/login', checkLoggedIn, function (req, res) {
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
router.get('/register', checkLoggedIn, function (req, res) {
    if (req.accepts("text/html")) {
        res.render("../views/register.ejs")
    } else {
        res.status(406).end();
    }
})

/*
    GET /
    If authentication is succesfull, redirects to the documents view.
        Otherwise, redirects to the GET /login
 */
router.get('/', function (req, res) {
    res.redirect('/docs')
})
        

/*
    GET /docs/new
    Creates a new document and redirects to GET /docs/:id.
 */
router.get('/docs/new', checkAuthenticated, async function (req, res) {
    const newdoc = await dbops.create_doc(ObjectId(req.user.user_id))

    if(req.accepts("text/html")) {
        res.redirect(`/docs/${newdoc._id.toHexString()}`)
    } else if(req.accepts("application/json")) {
        res.json(newdoc)
    }
})

/*
    GET /docs/:id
    Renders the document edit view for the specified document.
    IF the user only has read access to it, renders accordingly.
        IF the user has NO access to it, denies access to it.
 */
router.get('/docs/:id?', checkAuthenticated, async function (req, res) {
    if (req.params.id) {
        if (!(await dbops.document_exists({_id: ObjectId(req.params.id)}))) {
            res.status(404).end()
            return
        }

        // TODO: AUTH. Check if user is allowed to view/edit document
        if(true)
            res.render('../views/edit.ejs',{doc: await dbops.get_document(ObjectId(req.params.id))})
    } else { // Render document list
        res.render('../views/documents.ejs', {docs: await dbops.get_docs_available(ObjectId(req.user.user_id))})
    }

})


/*
    GET /verify/:id/:token
    Check the link sent by email to the user
    if user not found : 404
    If user is valid and token matches: redirect to login page and allow user authentication
    if token not valid : 401
 */
router.get('/verify/:id/:token', async function(req, res) {
    console.log(req.params.id, req.params.token)
    let user = await dbops.find_user({_id : ObjectId(req.params.id)});
    console.log(user)
    if (!user) { // this case should not happen (only if the user manually modify the link)
        res.status(404).send('User does not exists. Check if there is a typo in the link');
        return
    }

    if (user.token == req.params.token) {
        dbops.set_user_email_verificated(user._id).then( () => {
            req.flash('messageSuccess', 'Email verified!')
            res.redirect('/login');
        })
    } else {
        res.status(401).send('Token does not match. Check if there is a typo in the link');
    }
})



// ###############
// POST REQUESTS
// ###############

/*
    POST /auth
    Authenticates a user with credentials
 */
router.post("/auth", function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info ) {
        if (err) { return next(err); }
        
        if (info.status == 'fail') { return res.status(401).json(info); }

        req.logIn(user, function(err) {
            if (err) { return next(err); }
            req.flash('messageSuccess', 'Successfully logged in')
            res.json(info);
        });
    })(req, res, next);
});

/*
    POST /auth/register
    Registers a new user
 */
router.post("/auth/register",  function(req, res, next) {
    passport.authenticate('local-signup', function(err, user, info ) {
        if (err) { return next(err); }
        
        if (info.status == 'fail') { return res.status(401).json(info); }

        // do not log in user (email verification is needed)
        // req.logIn(user, function(err) {
        //     if (err) { return next(err); }
        req.flash('messageSuccess', 'Successfully registered')
        res.json(info);
        // });
    })(req, res, next);
});




  
// ###############
// DELETE REQUESTS
// ###############

/*
DELETE /logout
Log-out user
*/
router.delete("/logout", (req,res) => {
    req.logOut()
    req.flash('messageSuccess', 'Successfully logged out')
    res.redirect("/login")
})


/*
    DELETE /docs/:id
    Deletes a document.
 */
router.delete("/docs/:id", async (req, res) => {
    if (!(await dbops.document_exists({_id: ObjectId(req.params.id)}))) {
        res.status(404).end()
        return
    }

    const doc = await dbops.get_document(ObjectId(req.params.id))

    if(doc.owner == req.user.user_id)
        await dbops.delete_doc(ObjectId(req.params.id))
    
    res.end()
})