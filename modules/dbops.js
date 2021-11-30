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
 function find_user(filter) {
    return model.users.findOne(filter);
}



/**
 * Returns a certain document in the database.
 * @param {ObjectId} _id the ID of the document to look for.
 * @returns {Promise<[]>} A Promise that resolves with the fetched document. Resolves undefined if the document cant be found
 */
 function get_document(_id) {
    return model.docs.findOne({_id})
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
 * @param {String} hash the client-side hashed hash string password.
 * @returns {Promise<{}>} If the username is not taken yet, resolves with the new user data,
 *  If the username is already taken, the Promise rejects.
 */
function create_user(username,email,hash) {
    // Pwd hashing
    return new Promise(async (resolve, reject)=>{
        if(await user_exists({username:username})) {
            reject("Username already taken")
            return
        }
            
        const new_user = {
            username : username,
            email : email,
            password : await auth.encrypt_pwd(hash)
        }
        model.users.insertOne(new_user).then(() => {
            console.log("[+] Inserted user:",new_user)

            resolve(new_user)
        });
        
    })
}

/**
 * Creates and inserts a new document in the database.
 * @param {ObjectId} owner_id the owner of the newly created document.
 * @param {String="Untitled"} title the title of the newly created document.
 * @returns {Promise<object>} the data of the new document.
 */
function create_doc(owner_id, title="Untitled") {
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

            path : create_doc_file(), 
            
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
            
            resolve(new_doc)
        });
        

        // returns the path to the created file
        function create_doc_file() {
            // TODO: Implement doc writing on file.
        }
        
    })
}

/**
 * Deletes a user in the database.
 * @param {ObjectId} user_id the user to delete.
 * @returns { Promise<DeleteResult>} resolves when the action has been performed.
 */
function delete_user(user_id) {
    return model.docs.deleteOne({_id:user_id})
}

/**
 * Deletes a document in the database.
 * @param {ObjectId} doc_id the document to delete.
 * @returns { Promise<DeleteResult>} resolves when the action has been performed.
 */
function delete_doc(doc_id) {
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
    return new Promise(async (resolve, reject)=> {
        model.users.countDocuments(filter,(err,count)=>{
            if (err) reject(err)
            resolve(count>0)
        })
    })
}

// 

// Document exists ?
/**
 * Checks whether a certain document exists.
 * @param filter the filter of the document to look for.
 * @returns {Promise<boolean>} whether at least a document exists for the specified filter.
 */
function document_exists(filter={}) {
    return new Promise(async (resolve, reject)=>{
        model.docs.countDocuments(filter,(err,count)=>{
            if (err) reject(err)
            resolve(count>0)
        })
    })
}

// Get documents available to user
/**
 * Returns all the documents available for a specific user.
 * @param {ObjectId} user_id the user to return the documents for.
 * @returns {Promise<[]>} resolves with the documents that are available to the user.
 */
function get_docs_available(user_id) {
    const filter = {
        $or:[
            {perm_read : {$elemMatch : {$eq : user_id}}},
            {perm_edit : {$elemMatch : {$eq : user_id}}},
            {owner : {$elemMatch : {$eq : user_id}}}
        ]
    }
    return run_find(model.docs, filter)
}



// Get permissions of user over document
/**
 * Returns the permissions of a user over a document.
 * @param {ObjectId} user_id the user id.
 * @param {ObjectId} doc_id the document id.
 * @returns {Promise<["read"|"edit"|"owner"]>} Returns an array containing all the permissions of the user over the document.
 *  E.g  ["read","write","owner"]
 */
function get_user_perms(user_id, doc_id) {
    return new Promise(async (resolve, reject) => {
        const doc = await get_document(doc_id);

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

// TODO: Add function to manipulate document content.



module.exports = {
    run_query: run_find,
    find_user,
    get_document,
    create_user,
    create_doc,
    delete_user,
    delete_doc,
    user_exists,
    document_exists,
    get_docs_available,
    get_user_perms
}