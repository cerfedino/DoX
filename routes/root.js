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

    const newdoc = await dbops.doc_create(ObjectId(req.user.user_id))

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

    // Check first if ObjectID is valid
    if (req.params.id && !ObjectId.isValid(req.params.id)) {
        res.status(404).send('Invalid user ID. Check if there is a typo in: ' + req.url);
        return
    }

    if (req.params.id) {
        if (!(await dbops.doc_exists({_id: ObjectId(req.params.id)}))) {
            res.status(404).end()
            return
        }

        // TODO: AUTH. Check if user is allowed to view/edit document
        if(true)
            res.render('../views/edit.ejs',{doc: await dbops.doc_find({_id:ObjectId(req.params.id)})})
    } else { // Render document list
        res.render('../views/documents.ejs', {docs: await dbops.docs_available(ObjectId(req.user.user_id))})
    }

})

  
// ###############
// DELETE REQUESTS
// ###############

/*
    DELETE /docs/:id
    Deletes a document.
 */
router.delete("/docs/:id", async (req, res) => {
    
    // Check first if ObjectID is valid
    if (!ObjectId.isValid(req.params.id)) {
        res.status(404).send('Invalid user ID. Check if there is a typo in: ' + req.url);
        return
    }

    if (!(await dbops.doc_exists({_id: ObjectId(req.params.id)}))) {
        res.status(404).end()
        return
    }

    const doc = await dbops.doc_find({_id:ObjectId(req.params.id)})

    if(doc.owner == req.user.user_id)
        await dbops.doc_delete(ObjectId(req.params.id))
    
    res.end()
})