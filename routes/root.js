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

module.exports = router;

// PARAMETERS
const public = path.resolve(__dirname, "../public/")

router.get('/', function (req, res) {
    //TODO: Implement auth

    res.redirect("/login")
})

router.get('/login', function (req, res) {
    if (req.accepts("text/html")) {
        res.render('../views/login.ejs', {});
    } else {
        res.status(406).end();
    }
})


router.get('/register', function (req, res) {
    if (req.accepts("text/html")) {
        res.render("../views/register.ejs")
    } else {
        res.status(406).end();
    }
})


router.get('/doc/:id', function (req, res) {
    // TODO: Check if user is allowed to view/edit document
    res.render('../views/edit.ejs')
})

// Serves files inside the /public folder.
router.get("/*", (req,res)=>{
    const path = `${public}${req.path}`
    if (fs.pathExistsSync(path)) {
        res.status(200).sendFile(path)
    } else
        res.status(404).end()
})