/**
 * Web Atelier 2021  Final Project : DoX
 *
 * / API router
 *
 */

const express = require('express');
const path = require("path");
const router = express.Router();
const fs = require('fs-extra')

const dbops = require('../modules/dbops.js')
const {ObjectId} = require("mongodb");


module.exports = router;

// PARAMETERS
const public = path.resolve(__dirname, "../public/")
////////////////

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
router.get('/login', function (req, res) {
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
router.get('/docs/:id?', async function (req, res) {
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

/*
    GET /*
    Serves the files in the /public folder.
 */
router.get("/*", (req,res)=>{
    const path = `${public}${req.path}`
    if (fs.pathExistsSync(path)) {
        res.status(200).sendFile(path)
    } else
        res.status(404).end()
})


// ###############
// POST REQUESTS
// ###############

/*
    POST /auth
    Authenticates a user with credentials
 */
router.post("/auth",(req,res)=>{
    console.log("AUTH ATTEMPT")
    res.json("")
})

/*
    POST /auth/register
    Registers a new user
 */
router.post("/auth/register",(req,res)=>{
    console.log("REGISTER ATTEMPT")
    res.json("")
})

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