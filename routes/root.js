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
    GET /docs/:id
    Renders the document edit view for the specified document.
    IF the user only has read access to it, renders accordingly.
        IF the user has NO access to it, denies access to it.
 */
router.get('/docs/:id?', function (req, res) {
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
 */
router.post("/auth",(req,res)=>{

})

/*
    POST /auth/register
    Registers a new user
 */
router.post("/auth/register",(req,res)=>{

})