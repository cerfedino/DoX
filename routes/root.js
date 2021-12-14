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

const auth = require('../modules/auth.js');

const fs = require('fs-extra');
const path = require('path');

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
        return
    } else if(req.accepts("application/json")) {
        res.status(200).json(newdoc)
        return
    } else {
        res.status(406).send("Accepts: text/html or application/json").end();
        return
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
            res.status(404).render('../views/error.ejs', {s: 404, m: `Invalid document ID. Check if there is a typo in: ${req.url}`});
        } else {
            res.status(404).send(`Invalid document ID. Check if there is a typo in: ${req.url}`).end();
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
        
        if((await dbops.user_get_perms(ObjectId(req.user.user_id),ObjectId(req.params.id))).length > 0) {
            if(req.accepts("text/html")) {
                res.status(200).render('../views/edit.ejs',
                    {
                        doc: await dbops.doc_find({_id:ObjectId(req.params.id)}),
                        user : await dbops.user_find({_id : ObjectId(req.user.user_id)})
                    })
            } else if (req.accepts("application/json")) {
                res.json({doc: await dbops.doc_find({_id:ObjectId(req.params.id)})});
            } else {
                res.status(406).send("Accepts: text/html").end()
            }
        }
    } else { // Render document list
        if(req.accepts("text/html")) {
            res.status(200).render('../views/documents.ejs',
                {
                    docs: await dbops.docs_available(ObjectId(req.user.user_id)),
                    user : await dbops.user_find({_id : ObjectId(req.user.user_id)})
                })
        } else {
            res.status(406).send("Accepts: text/html").end();
        }
    }

})


/* 
    GET /users/:id
    Returns the username matching the given user ID
*/
router.get('/users/:id', async function (req, res){
    let id;
    try {
        id = ObjectId(req.params.id);
    } catch(err) {
        res.status(404).end();
    }
    let user = await dbops.user_find({_id : id});
    if (req.accepts("application/json")){
        if (user == undefined || user == null) {
            res.status(404).end();
        } else {
            res.json({username:user.username});
        }
    } else {
        res.status(406).end();
    }
})

// Gets user profile picture based on ID

router.get("/pic/users/:id", async function (req, res){
    let id;
    try {
        id = ObjectId(req.params.id);
    } catch(err) {
        res.status(404).end();
    }
    let user = await dbops.user_find({_id : id});
    if (user) { 
        if (req.accepts("image/png")) {
            res.sendFile(user.profile_pic);
        } else {
            console.log("err")
        } 
    } else {
        res.status(404).end();
    }
    

})

// ###############
// PUT REQUESTS
// ###############

/*
    PUT /docs/:id
    Updates a document data. The tags to update are accessed in req.body.tags

    Updates permissions ONLY if the request is coming from the owner of the document.
    Special fields in req.body.tags:
        - {String[]} perm_read_add      : An array containing the user ID's to incrementally add to the existing perm_read array.
        - {String[]} perm_read_remove   : An array containing the user ID's to remove from the existing perm_read array.
        - {String[]} perm_edit_add      : An array containing the user ID's to incrementally add to the existing perm_edit array.
        - {String[]} perm_edit_remove   : An array containing the user ID's to remove from the existing perm_edit array.
*/
router.put('/docs/:id', checkAuthenticated, async (req,res)=> {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(400).send(`Invalid doc ID.`);
        return
    }
    if (!ObjectId.isValid(req.user.user_id)) {
        res.status(400).send(`Invalid user ID.`);
        return
    }
    if(!(await dbops.doc_exists({_id:ObjectId(req.params.id)}))) {
        if(req.accepts("text/html")) {
            res.status(404).render('../views/error.ejs', {s: 404, m: "Document does not exist"});
        } else {
            res.status(404).send("Document does not exist").end();
        }
        return
    }

    // Fetches the permissions of the authenticated user over the document.
    const perms = await dbops.user_get_perms(ObjectId(req.user.user_id),ObjectId(req.params.id))
    if (!perms.includes("edit") && !perms.includes("owner")) {
        // The user does not have any kind of edit permission on the document (e.g. he's only a 'reader')
        res.status(403).send('You are not allowed to modify this document')
        return
    }

    var tags = get_editable_doc_fields(req.body.tags) || {}
    
    // Only the owner can change document permissions.
    if (!perms.includes("owner")) {
        // Removes any tags that require the user to be the owner.
        const restrictedFields   =  ["owner",
                                    "edit_link","read_link",
                                    "perm_edit","perm_read",
                                    "perm_read_add" , "perm_read_remove",
                                    "perm_edit_add" , "perm_edit_remove"]
        restrictedFields.forEach(f=>{delete tags[f]})
    }

    // If the specified owner is not valid (ie not a valid user ID does not exist)
    if(!(await dbops.isValidUser(tags.owner)))
        delete tags.owner
    else
        tags.owner = ObjectId(tags.owner)

    delete tags.edit_date; delete tags.created_date

    if(tags.perm_read || tags.perm_edit) {
        var newperm = {}
        if(tags.perm_read)
            newperm.perm_read = tags.perm_read
        if(tags.perm_edit)
            newperm.perm_edit = tags.perm_edit

        Object.keys(newperm).forEach(x=>newperm[x]=newperm[x].map(hex=>{return ObjectId(hex)}))

        await dbops.doc_set(ObjectId(req.params.id), newperm, false)

        delete tags.perm_read; delete tags.perm_edit
    }


    // Handles incremental permission addition/removal
    if(tags.perm_read_add || tags.perm_edit_add) {
        await dbops.doc_add_permissions(ObjectId(req.params.id),
            {
                perm_read_add: await dbops.getValidObjectIds(tags.perm_read_add, dbops.isValidUser),
                perm_edit_add: await dbops.getValidObjectIds(tags.perm_edit_add, dbops.isValidUser),
            })

        delete tags.perm_read_add; delete tags.perm_edit_add
    }
    if(tags.perm_read_remove || tags.perm_edit_remove) {
        await dbops.doc_remove_permissions(ObjectId(req.params.id),
            {
                perm_read_remove: await dbops.getValidObjectIds(tags.perm_read_remove, dbops.isValidUser),
                perm_edit_remove: await dbops.getValidObjectIds(tags.perm_edit_remove, dbops.isValidUser),
            })
        delete tags.perm_read_remove; delete tags.perm_edit_remove
    }
    //
    await dbops.doc_set(ObjectId(req.params.id), tags, false)
    console.log("[+] Updated document")
    req.flash("messageSuccess","Document has been updated")
    res.status(200).end()
})



function get_editable_doc_fields(obj={}) {
    var ret = {
        title: obj.title,

        content: obj.content,

        perm_read: obj.perm_read,
        perm_edit: obj.perm_edit,

        owner: obj.owner,
        read_link: obj.read_link,
        edit_link: obj.edit_link,

        // Special fields
        perm_read_add: obj.perm_read_add,
        perm_read_remove: obj.perm_read_remove,
        perm_edit_add: obj.perm_edit_add,
        perm_edit_remove: obj.perm_edit_remove,
    }
    Object.keys(ret).forEach(key => { if(!ret[key]) delete ret[key]})
    return ret
}



/*
    PUT /user
    Updates a user data.

    Updates user only if the request is coming from the user himself.
*/
router.put('/user', async (req,res)=> {
    if (!ObjectId.isValid(req.user.user_id)) {
        res.status(400).send(`Invalid user ID.`);
        return
    }
    if(!(await dbops.user_exists({_id:ObjectId(req.user.user_id)}))) {
        if(req.accepts("text/html")) {
            res.status(404).render('../views/error.ejs', {s: 404, m: "User does not exist"});
        } else {
            res.status(404).send("User does not exist").end();
        }
        return
    }
    
    let tags = {}
    
    if (req.body.username && (!await (dbops.user_exists({username : req.body.username})))) {
        tags.username = req.body.username;
    }
    if (req.body.password) {
        tags.password = await auth.encrypt_pwd(req.body.password);
    }



    if (req.files && Object.keys(req.files).length > 0) {
        // new profile picture uploaded

        let file = req.files["file"];
        let ext = path.extname(file.name);

        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return res.status(400).send("bad file type");
        }

        let file_url = "./public/media/profile_pics/" + req.user.user_id + ".png";

        await file.mv(file_url, function(err) { 
            if(err) throw err;
            console.log("[+] File moved to folder")
        })

        tags.profile_pic = file_url;

    }

    dbops.user_set(new ObjectId(req.user.user_id), tags).then(newuser => {
        console.log("[+] Updated user")
        req.flash("messageSuccess","User has been updated")
        res.redirect("/docs");
    })
    
    
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