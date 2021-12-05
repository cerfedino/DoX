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
    res.status(304).redirect("/login")
}

/*
    Middleware to check if the user is already logged in
 */
function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.status(304).redirect("/docs")
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
        res.status(200).render('../views/login.ejs');
    } else {
        res.status(406).send("Accepts: text/html").end();
    }
})

/*
    GET /register
    Renders the register form.
 */
router.get('/register', checkLoggedIn, function (req, res) {
    if (req.accepts("text/html")) {
        res.status(200).render("../views/register.ejs")
    } else {
        res.status(406).send("Accepts: text/html").end();
    }
})

/*
    GET /
    If authentication is succesfull, redirects to the documents view.
        Otherwise, redirects to the GET /login
 */
router.get('/', function (req, res) {
    res.status(302).redirect('/docs')
})
        

/*
    GET /docs/new
    Creates a new document and redirects to GET /docs/:id.
 */
router.get('/docs/new', checkAuthenticated, async function (req, res) {

    const newdoc = await dbops.doc_create(ObjectId(req.user.user_id))

    if(req.accepts("text/html")) {
        res.status(302).redirect(`/docs/${newdoc._id.toHexString()}`)
    } else if(req.accepts("application/json")) {
        res.status(200).json(newdoc)
    } else {
        res.status(406).send("Accepts: text/html or application/json").end();
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
        if(req.accepts("text/html")) {
            res.status(404).render('../views/error.ejs', {s: 404, m: `Invalid user ID. Check if there is a typo in: ${req.url}`});
        } else {
            res.status(404).send(`Invalid user ID. Check if there is a typo in: ${req.url}`).end();
        }
        return
    }

    if (req.params.id) {
        if (!(await dbops.doc_exists({_id: ObjectId(req.params.id)}))) {
            if(req.accepts("text/html")) {
                res.status(404).render('../views/error.ejs', {s: 404, m: "Document does not exist"});
            } else {
                res.status(404).send("Document does not exist").end();
            }
            return
        }

        // TODO: AUTH. Check if user is allowed to view/edit document
        if(true) {
            if(req.accepts("text/html")) {
                res.status(200).render('../views/edit.ejs',{doc: await dbops.doc_find({_id:ObjectId(req.params.id)})})
            } else {
                res.status(406).send("Accepts: text/html").end()
            }
            
        }
    } else { // Render document list
        if(req.accepts("text/html")) {
            res.status(200).render('../views/documents.ejs', {docs: await dbops.docs_available(ObjectId(req.user.user_id))})
        } else {
            res.status(406).send("Accepts: text/html").end();
        }
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
        if(req.accepts("text/html")) {
            res.status(404).render('../views/error.ejs', {s: 404, m: `Invalid user ID. Check if there is a typo in: ${req.url}`});
        } else {
            res.status(404).send(`Invalid user ID. Check if there is a typo in: ${req.url}`).end();
        }
        return
    }

    if (!(await dbops.doc_exists({_id: ObjectId(req.params.id)}))) {
        if(req.accepts("text/html")) {
            res.status(404).render('../views/error.ejs', {s: 404, m: "Document does not exist"});
        } else {
            res.status(404).send("Document does not exist").end();
        }
        return
    }

    const doc = await dbops.doc_find({_id:ObjectId(req.params.id)})

    if(doc.owner == req.user.user_id)
        await dbops.doc_delete(ObjectId(req.params.id))
    
    res.status(200).end()
})