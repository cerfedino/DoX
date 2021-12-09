const {model} = require('../models')
const auth = require("./auth.js")
const {ObjectId} = require("mongodb");

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
function user_find(filter = {}) {
    return model.users.findOne(filter);
}


/**
 * Returns a certain document in the database.
 * @param {object} filter the filter of the user to look for.
 * @returns {Promise<[]>} A Promise that resolves with the fetched document. Resolves undefined if the document cant be found
 */
function doc_find(filter = {}) {
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
function user_create(username, email, password, token = '', returnnew = true) {
    // Pwd hashing
    return new Promise(async (resolve, reject) => {
        if (await user_exists({username: username})) {
            reject("Username already taken")
            return
        }

        const new_user = {
            username: username,
            email: email,
            password: await auth.encrypt_pwd(password),
            token: token,
            email_verification_status: false
        }
        model.users.insertOne(new_user).then(() => {
            console.log("[+] Inserted user:", new_user)

            resolve(returnnew ? new_user : undefined)
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
function doc_create(owner_id, title = "Untitled", returnnew = true) {
    // Pwd hashing
    return new Promise(async (resolve, reject) => {
        if (!(await user_exists({_id: owner_id}))) {
            reject("User not found")
            return
        }

        // Re-hashing the client-side hash
        const date = new Date()

        const new_doc = {

            title: title,

            content: {
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph"
                    }
                ]
            },

            perm_read: [owner_id],
            perm_edit: [owner_id],

            owner: owner_id,

            read_link: undefined,
            edit_link: undefined,

            edit_date: date,
            created_date: date,
        }

        model.docs.insertOne(new_doc).then((res) => {
            console.log("[+] Inserted doc:", new_doc)

            resolve(returnnew ? new_doc : undefined)
        });

    })
}

/**
 * Deletes a user in the database.
 * @param {ObjectId} user_id the user to delete.
 * @returns { Promise<DeleteResult>} resolves when the action has been performed.
 */
function user_delete(user_id) {
    return model.docs.deleteOne({_id: user_id})
}

/**
 * Deletes a document in the database.
 * @param {ObjectId} doc_id the document to delete.
 * @returns { Promise<DeleteResult>} resolves when the action has been performed.
 */
function doc_delete(doc_id) {
    return model.docs.deleteOne({_id: doc_id})
}

// ######################

// HELPER FUNCTIONS

// ######################

/**
 * Checks whether a certain user exists.
 * @param filter the filter of the user to look for.
 * @returns {Promise<boolean>} whether at least a user exists for the specified filter.
 */
function user_exists(filter = {}) {
    return new Promise((resolve, reject) => {
        model.users.countDocuments(filter, (err, count) => {
            if (err) reject(err)
            resolve(count > 0)
        })
    })
}

// Document exists ?
/**
 * Checks whether a certain document exists.
 * @param filter the filter of the document to look for.
 * @returns {Promise<boolean>} whether at least a document exists for the specified filter.
 */
function doc_exists(filter = {}) {
    return new Promise((resolve, reject) => {
        model.docs.countDocuments(filter, (err, count) => {
            if (err) reject(err)
            resolve(count > 0)
        })
    })
}

/**
 * Takes an array of hexadecimal strings and returns an array containing every ObjectId representation, if the HEX string is valid.
 * @param {String[]} hex_arr the array of hexadecimal strings representing the ObjectId's
 * @param {Promise<boolean>} filtering_promise the promise that takes the HEX string and returns whether its valid or not.
 *  Expected to be a reference to either:
 *      function isValidUser()
 *      function isValidDocument()
 * @returns {ObjectId[]} an array containing al the valid ObjectIds.
 */
function getValidObjectIds(hex_arr = [], filtering_promise) {
    return new Promise(async (resolve, reject) => {
        var ret = []

        for (idx in hex_arr) {
            if (await (filtering_promise(hex_arr[idx]))) {
                ret.push(ObjectId(hex_arr[idx]))
            }
        }

        resolve(ret)
    })

}

/**
 * Takes a HEX string and checks whether its a valid USER ID.
 * @param {String} user_id the HEX string to validate.
 * @returns {Promise<boolean>} resolves on whether the HEX string is a valid USER ID or not.
 */
function isValidUser(user_id) {
    return new Promise(async (resolve, reject) => {
        resolve(ObjectId.isValid(user_id) && await user_exists({_id: ObjectId(user_id)}))
    })
}

/**
 * Takes a HEX string and checks whether its a valid DOCUMENT ID.
 * @param {String} doc_id the HEX string to validate.
 * @returns {Promise<boolean>} resolves on whether the HEX string is a valid USER ID or not.
 */
function isValidDocument(doc_id) {
    return new Promise(async (resolve, reject) => {
        resolve(ObjectId.isValid(doc_id) && await doc_exists({_id: ObjectId(doc_id)}))
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
        $or: [
            {perm_read: {$elemMatch: {$eq: user_id}}},
            {perm_edit: {$elemMatch: {$eq: user_id}}},
            {owner: {$eq: user_id}}
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
function user_set(user_id, tags, returnnew = true) {
    return new Promise(async (resolve, reject) => {
        if (!(await user_exists({_id: user_id}))) {
            reject("Document does not exist")
            return
        }
        await model.users.findOneAndUpdate({_id: user_id}, {"$set": tags})
        resolve(returnnew ? await user_find({_id: user_id}) : undefined)
    })
}

/**
 * Sets any parameter of a specific document and resolves with the updated document data.
 * @param {ObjectId} doc_id the specific document to be updated.
 * @param {object} tags an object containing the updated fields to write on the document.
 * @param {boolean=true} returnnew whether to return the updated document data.
 * @returns {Promise<object>} a promise resolving with the updated document data.
 */
function doc_set(doc_id, tags, returnnew = true) {
    return new Promise(async (resolve, reject) => {
        if (!(await doc_exists({_id: doc_id}))) {
            reject("Document does not exist")
            return
        }
        await model.docs.findOneAndUpdate({_id: doc_id}, {"$set": tags})
        resolve(returnnew ? await doc_find({_id: doc_id}) : undefined)
    })
}

/**
 * Updates the content of a document and resolves with the updated document data.
 * @param {ObjectId} doc_id the specific document to be updated.
 * @param {object} content an object containing the new content data.
 * @param {boolean=true} returnnew whether to return the updated document data.
 * @returns {Promise<object>} a promise resolving with the updated document data.
 */
function doc_set_content(doc_id, content = {}, returnnew = true) {
    return doc_set(doc_id, {"content": content}, returnnew)
}

/**
 * Adds read/edit permissions to an array of users.
 * @param {ObjectId} doc_id the specific document to be updated.
 * @param {object} perms an object containing the incremental permission updates.
 *  The object is structured as follows:
 *      {
 *          {ObjectId[]} perm_read_add    : array containing all the user ID's to add to the read permission array of the document.
 *          {ObjectId[]} perm_edit_add    : array containing all the user ID's to add to the edit permission array of the document.
 *      }
 * @param {boolean=true} returnnew whether to return the updated document data.
 * @returns {Promise<object>} a promise resolving with the updated document data or with undefined.
 */
function doc_add_permissions(doc_id, perms = {perm_read_add: [], perm_edit_add: []}, returnnew = true) {
    return new Promise(async (resolve, reject) => {
        if (!(await doc_exists({_id: doc_id})))
            reject("Document does not exist")

        model.docs.findOneAndUpdate(
            {_id: doc_id},
            {
                $addToSet: {
                    perm_edit: {$each: perms.perm_edit_add || []},
                    perm_read: {$each: perms.perm_read_add || []}
                }
            })
        resolve(returnnew ? await doc_find({_id: doc_id}) : undefined)
    })
}

/**
 * Removes read/edit permissions to an array of users.
 * @param {ObjectId} doc_id the specific document to be updated.
 * @param {object} perms an object containing the incremental permission updates.
 *  The object is structured as follows:
 *      {
 *          {ObjectId[]} perm_read_remove    : array containing all the user ID's to remove from the read permission array of the document.
 *          {ObjectId[]} perm_edit_remove    : array containing all the user ID's to remove from the edit permission array of the document.
 *      }
 * @param {boolean=true} returnnew whether to return the updated document data.
 * @returns {Promise<object>} a promise resolving with the updated document data or with undefined.
 */
function doc_remove_permissions(doc_id, perms = {perm_read_remove: [], perm_edit_remove: []}, returnnew = true) {
    return new Promise(async (resolve, reject) => {
        if (!(await doc_exists({_id: doc_id})))
            reject("Document does not exist")

        console.log(await model.docs.findOne({_id: doc_id}))
        model.docs.findOneAndUpdate(
            {_id: doc_id},
            {
                "$pullAll": {
                    perm_edit: perms.perm_edit_remove || [],
                    perm_read: perms.perm_read_remove || []
                }
            })


        console.log(await model.docs.findOne({_id: doc_id}))

        resolve(returnnew ? await doc_find({_id: doc_id}) : undefined)
    })
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
        const doc = await doc_find({_id: doc_id});

        var ret = []
        if (doc.perm_read.some((usr) => {
            return usr.toHexString() == user_id.toHexString()
        })) {
            ret.push("read")
        }
        if (doc.perm_edit.some((usr) => {
            return usr.toHexString() == user_id.toHexString()
        })) {
            ret.push("edit")
        }
        if (doc.owner.toHexString() == user_id.toHexString())
            ret.push("owner")

        resolve(ret)
    })
}

/**
 * To set into the db that the email has been verified
 * @param {ObjectId} user_id the user id.
 * @returns {Promise<[]>} A Promise that resolves with the updated user. Resolves undefined if the user cant be found
 */
function user_set_email_verification(user_id) {
    return user_set(user_id, {email_verification_status: true}, false);
}


module.exports = {
    run_find,
    user_find,
    doc_find,

    user_create,
    user_exists,
    user_delete,
    user_set,

    getValidObjectIds,
    isValidUser,
    isValidDocument,

    doc_create,
    doc_exists,
    doc_delete,
    doc_set,
    doc_set_content,
    doc_add_permissions,
    doc_remove_permissions,

    docs_available,
    user_get_perms,
    user_set_email_verification
}