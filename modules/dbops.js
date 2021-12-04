const {model} = require('../models')
const auth = require("./auth.js")

/**
 * Contains all database operations.
 */



// ######################

// GETTERS

// ######################

/**
 * Runs a find on a collection and returns the resulting array.
 * @param {Collection<Document>} collection the collection to perform the find query on.
 * @param {object} filter the filter of the query.
 * @returns {Promise<[]>} returns the array resulting from the find query.
 */
function run_find(collection, filter) {
    return new Promise(async (resolve, reject) => {
        resolve(await (collection.find(filter).toArray()))
    })
}

/**
 * Returns a certain user in the database.
 * @param {object} filter the filter of the user to look for.
 * @returns {Promise<[]>} A Promise that resolves with the fetched user. Resolves undefined if the user cant be found
 */
function user_find(filter={}) {
    return model.users.findOne(filter);
}



/**
 * Returns a certain document in the database.
 * @param {object} filter the filter of the user to look for.
 * @returns {Promise<[]>} A Promise that resolves with the fetched document. Resolves undefined if the document cant be found
 */
 function doc_find(filter={}) {
    return model.docs.findOne(filter)
}


// ######################
// ######################

// SETTERS

// ######################

// Create user w/hashing
/**
 * Creates and inserts a new user in the database.
 * @param {String} username the username of the new user.
 * @param {String} email the email address of the new user.
 * @param {String} password the string password.
 * @param {boolean=true} returnnew whether to return the new database element.
 * @returns {Promise<{}>} If the username is not taken yet, resolves with the new user data,
 *  If the username is already taken, the Promise rejects.
 */
function user_create(username,email,password,token='', returnnew=true) {
    // Pwd hashing
    return new Promise(async (resolve, reject)=>{
        if(await user_exists({username:username})) {
            reject("Username already taken")
            return
        }
            
        const new_user = {
            username : username,
            email : email,
            password : await auth.encrypt_pwd(password),
            token: token,
            email_verification_status : false
        }
        model.users.insertOne(new_user).then(() => {
            console.log("[+] Inserted user:",new_user)

            resolve(returnnew? new_user : undefined)
        });
        
    })
}

/**
 * Creates and inserts a new document in the database.
 * @param {ObjectId} owner_id the owner of the newly created document.
 * @param {String="Untitled"} title the title of the newly created document.
 * @param {boolean=true} returnnew whether to return the new database element.
 * @returns {Promise<object>} the data of the new document.
 */
function doc_create(owner_id, title="Untitled", returnnew=true) {
    // Pwd hashing
    return new Promise(async (resolve, reject)=>{
        if(!(await user_exists({_id:owner_id}))) {
            reject("User not found")
            return
        }
            
        // Re-hashing the client-side hash
        const date = new Date()

        const new_doc = {

            title : title,

            content : {},
            
            perm_read : [owner_id], 
            perm_edit : [owner_id],
        
            owner : owner_id, 
        
            read_link : undefined, 
            edit_link : undefined, 
        
            edit_date : date, 
            created_date : date,
        }

        model.docs.insertOne(new_doc).then( (res) => {
            console.log("[+] Inserted doc:",new_doc)
            
            resolve(returnnew? new_doc: undefined)
        });
        
    })
}

/**
 * Deletes a user in the database.
 * @param {ObjectId} user_id the user to delete.
 * @returns { Promise<DeleteResult>} resolves when the action has been performed.
 */
function user_delete(user_id) {
    return model.docs.deleteOne({_id:user_id})
}

/**
 * Deletes a document in the database.
 * @param {ObjectId} doc_id the document to delete.
 * @returns { Promise<DeleteResult>} resolves when the action has been performed.
 */
function doc_delete(doc_id) {
    return model.docs.deleteOne({_id:doc_id})
}

// ######################

// HELPER FUNCTIONS

// ######################

/**
 * Checks whether a certain user exists.
 * @param filter the filter of the user to look for.
 * @returns {Promise<boolean>} whether at least a user exists for the specified filter.
 */
function user_exists(filter={}) {
    return new Promise((resolve, reject)=> {
        model.users.countDocuments(filter,(err,count)=>{
            if (err) reject(err)
            resolve(count>0)
        })
    })
}

// Document exists ?
/**
 * Checks whether a certain document exists.
 * @param filter the filter of the document to look for.
 * @returns {Promise<boolean>} whether at least a document exists for the specified filter.
 */
function doc_exists(filter={}) {
    return new Promise( (resolve, reject)=>{
        model.docs.countDocuments(filter,(err,count)=>{
            if (err) reject(err)
            resolve(count>0)
        })
    })
}
//

// Get documents available to user
/**
 * Returns all the documents available for a specific user.
 * @param {ObjectId} user_id the user to return the documents for.
 * @returns {Promise<[]>} resolves with the documents that are available to the user.
 */
function docs_available(user_id) {
    const filter = {
        $or:[
            {perm_read : {$elemMatch : {$eq : user_id}}},
            {perm_edit : {$elemMatch : {$eq : user_id}}},
            {owner : {$elemMatch : {$eq : user_id}}}
        ]
    }
    return run_find(model.docs, filter)
}

/**
 * Sets any parameter of a specific user and resolves with the updated user data.
 * @param {ObjectId} user_id the specific user to be updated.
 * @param {object} tags an object containing the updated fields to write on the user.
 * @param {boolean=true} returnnew whether to return the updated user data.
 * @returns {Promise<object>} a promise resolving with the updated user data.
 */
function user_set(user_id, tags, returnnew=true) {
    return new Promise(async (resolve, reject) => {
        if (!(await user_exists({_id:user_id}))) {
            reject("Document does not exist")
            return
        }
        await model.users.findOneAndUpdate({_id:user_id}, {"$set" : tags})
        resolve(returnnew ? await user_find({_id:user_id}) : undefined)
    })
}

/**
 * Sets any parameter of a specific document and resolves with the updated document data.
 * @param {ObjectId} doc_id the specific document to be updated.
 * @param {object} tags an object containing the updated fields to write on the document.
 * @param {boolean=true} returnnew whether to return the updated document data.
 * @returns {Promise<object>} a promise resolving with the updated document data.
 */
function doc_set(doc_id, tags, returnnew=true) {
    return new Promise(async (resolve, reject)=>{
        if (!(await doc_exists({_id:doc_id}))) {
            reject("Document does not exist")
            return
        }
        await model.docs.findOneAndUpdate({_id:doc_id}, {"$set" : tags})
        resolve(returnnew? await doc_find({_id:doc_id}) : undefined)
    })
}

/**
 * Updates the content of a document and resolves with the updated document data.
 * @param {ObjectId} doc_id the specific document to be updated.
 * @param {object} content an object containing the new content data.
 * @param {boolean=true} returnnew whether to return the updated document data.
 * @returns {Promise<object>} a promise resolving with the updated document data.
 */
function doc_set_content(doc_id, content={}, returnnew=true) {
    return doc_set(doc_id,{"content" : content}, returnnew)
}


// Get permissions of user over document
/**
 * Returns the permissions of a user over a document.
 * @param {ObjectId} user_id the user id.
 * @param {ObjectId} doc_id the document id.
 * @returns {Promise<["read"|"edit"|"owner"]>} Returns an array containing all the permissions of the user over the document.
 *  E.g  ["read","write","owner"]
 */
function user_get_perms(user_id, doc_id) {
    return new Promise(async (resolve, reject) => {
        const doc = await doc_find({_id:doc_id});

        var ret = []
        if(doc.perm_read.includes(user_id))
            ret.push("read")
        if(doc.perm_edit.includes(user_id))
            ret.push("edit")
        if(doc.owner == user_id)
            ret.push("owner")

        return ret
    })
}

/**
 * To set into the db that the email has been verified
 * @param {ObjectId} user_id the user id.
 * @returns {Promise<[]>} A Promise that resolves with the updated user. Resolves undefined if the user cant be found
 */
function user_set_email_verification(user_id) { 
    return user_set(user_id ,{ email_verification_status : true }, false);
}


// TODO: Add function to manipulate document content.



module.exports = {
    run_find,
    user_find,
    doc_find,
    user_create,
    doc_create,
    doc_set,
    doc_set_content,
    user_delete,
    doc_delete,
    user_exists,
    doc_exists,
    docs_available,
    user_get_perms,
    user_set_email_verification
}