/**
 * Web Atelier 2021  Final Project : DoX
 *
 * / API router
 *
 */

const express = require('express');
const path = require("path");
const router = express.Router();

const dbops = require('../modules/dbops.js')
const {ObjectId} = require("mongodb");


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
    if (req.isAuthenticated()) {
        return res.redirect("/docs")
    }
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
router.get('/register', function (req, res) {
    if (req.accepts("text/html")) {
        res.render("../views/register.ejs")
    } else {
        res.status(406).end();
    }
})


/*
    GET /docs/new
    Creates a new document and redirects to GET /docs/:id.
 */
router.get('/docs/new', async function (req, res) {
    const newdoc = await dbops.create_doc(ObjectId('61a66271ceec42204e460cdd'))

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
        res.render('../views/edit.ejs',{doc: await dbops.get_document(ObjectId(req.params.id))})
    } else { // Render document list

        // TODO: Retrieve user through token ?
        res.render('../views/documents.ejs', {docs: await dbops.get_docs_available(ObjectId('61a66271ceec42204e460cdd'))})
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

// router.post("/auth", function(req, res) {
//     passport.authenticate('local-login', function(err, user, info) {
    //     console.log('err : ',err)
    //     console.log('user : ',user)
    //     console.log('info : ',info)
        
    //     if (err) {
    //         res.status(404).json(err);
    //         return;
    //     }
    //     if (user) {
    //         res.status(200);
    //         res.json(user);
    //     } else {
    //         res.status(401).json({
    //             type: 'messageFailure',
    //             message: 'Invalid username and/or password.'
    //         });
    //     }
    // }) (req, res);
// })

// {
//     successRedirect: "/docs",
//     failureRedirect: "/login",
//     failureFlash: {
//         type: 'messageFailure',
//         message: 'Invalid username and/or password.'
//     },
//     successFlash: {
//         type: 'messageSuccess',
//         message: 'Successfully logged in.'
//     }
// }))


// router.post("/auth", function(req, res, next) {
//     passport.authenticate('local-login', function(err, user, info) {
//         console.log('err : ',err)
//         console.log('user : ',user)
//         console.log('info : ',info)
//         if (err) { return next(err); }
//         if (!user) { return res.status(401).json(info); }
//         req.logIn(user, function(err) {
//                 if (err) { return next(err); }
//                 req.flash('messageSuccess', 'Successfully logged in')
//                 console.log('loggedin')
//                 return res.redirect('/docs');
//         });
//     })(req, res, next);
//   });

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

// router.get("/auth/status",(req,res)=>{
//     let auth = {}
//     if(req.flash('messageSuccess')) {
//         auth.status="ok"
//     } else if(req.flash('messageFailure')) {
//         auth.status
//     }
//     if(req.flash('messageFailure') || req.flash('messageSuccess')) {
//         auth.status = 
//     }
//     res.json({
        
//     })
// })


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

  
// ###############
// DELETE REQUESTS
// ###############


/*
    DELETE /docs/:id
    Deletes a document.
 */
router.delete("/docs/:id", async (req, res) => {
    if (!(await dbops.document_exists({_id: ObjectId(req.params.id)}))) {
        res.status(404).end()
        return
    }

    // TODO: Check if user is owner of document.
    if(true)
        await dbops.delete_doc(ObjectId(req.params.id))
    res.end()
})