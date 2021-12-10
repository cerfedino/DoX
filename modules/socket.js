const io = require("socket.io")({'pingTimeout':1000,'pingInterval': 2000})
const {events} = require("./dbops.js")
const app = require('../app')
const dbops = require('./dbops.js')
const {ObjectId} = require("mongodb");


/**
 *  Initializes the server socket.
 */
module.exports.init = function (server) {

    io.attach(server)

    // Maps every user to its list of connected sockets to server
    var connected_users = {}

    console.log("Connected users: ",connected_users)

    io.use(function (socket, next) {
        app.sessionMid(socket.request, {}, next);
    }).on("connection", async function (socket) {

        // New socket setup
        try {
            socket.request.session.passport.user.user_id
            ObjectId(socket.request.session.passport.user.user_id)
        } catch(err) {
            // User is not authenticated yet
            return
        }

        // USER IS AUTHENTICATED

        const userId = socket.request.session.passport.user.user_id;

        // Maps and keeps track of this socket relative to its authenticated users
        if(!connected_users[userId]) {
            connected_users[userId] = []
        }
        connected_users[userId].unshift(socket.id)
        //

        console.log("Connected users: ",connected_users)

        // Adds the user to his own personal user room, this way we can relay messages to every socket associated to a specific user
        socket.join("user:"+userId)

        socket.on('disconnect', function(socket) {
            console.log("[-] User ", userId, " disconnected")
            connected_users[userId].splice(connected_users[userId].indexOf(socket.id),1)
            if(connected_users[userId].length == 0) {
                delete connected_users[userId]
            }
            console.log("Connected users: ",connected_users)
        })

        // Makes the socket monitor all of the documents associated with the user
        const docs = await dbops.docs_available(ObjectId(userId))
        docs.forEach(doc => {
            socket.join("document:"+doc._id.toHexString())
        })

        // Received when a socket wants to be kept updates on any events on a specific documents.
        //  Satisfies the socket's request only if the user is allowed to access the document in the first place.
        socket.on('subscribe_to_doc_events',async function (msg) {
            if(await dbops.isValidDocument(msg._id) && await dbops.isValidUser(userId) && (await dbops.user_get_perms(ObjectId(userId), ObjectId(msg._id))).length > 0) {
                console.log("Adding user to room ","document:"+msg._id)
                socket.join("document:"+msg._id)
            }
        })


        //////////

        // socket.on("doc-join-request",async function (msg) {
        //     console.log(msg)
        //     if (await dbops.isValidUser(userId) && await dbops.isValidDocument(msg.doc_id)) {
        //         const perms = await dbops.user_get_perms(ObjectId(userId),ObjectId(msg.doc_id))
        //         if(perms.includes("edit") || perms.includes("owner")) {
        //             console.log("USER IS ALLOWED")
        //             socket.join(`${msg.doc_id}-PRIVATE`)
        //         }
        //         if(perms.length > 0)
        //             socket.join(`${msg.doc_id}`)
        //     }
        // })
    });

    //// Relays the database change to every related socket.
    events.on("db-event", async ev => {
        console.log(ev)
        if(ev.subject.type == "document") {
            if(ev.type == "add") {  // If a new document has been added, manually notifies every involved user.
                await manually_relay_to_involved_users(ev.subject._id, ev)
            } else { // Otherwise updates every socket in the document's room.
                console.log("Sending back to room ","document:"+ev.subject._id)
                io.to("document:"+ev.subject._id).emit(ev.event, ev)
            }
        } else if(ev.subject.type == "user") {
            // Events regarding user data
            // TODO: Handle user data change.
        }
    })


    /**
     * Manually relays an event to all users with whom have access to a document.
     *  This function is resource intensive, use only when there is no room yet for the document.
     *      (   e.g the document has just been created and the server needs to inform the users )
     * @param {String} doc_id the ID of the document.
     * @param {object} ev the event object to manually relay to the users that have access to the document.
     */
    async function manually_relay_to_involved_users(doc_id, ev) {
        if(await dbops.isValidDocument(doc_id)) {
            const doc = await dbops.doc_find({_id:ObjectId(doc_id)})
            var users = []
            users.push("user:"+doc.owner.toHexString())
            doc.perm_read.forEach(usr => {
                users.push("user:"+usr.toHexString())
            })
            doc.perm_edit.forEach( usr => {
                users.push("user:"+usr.toHexString())
            })
            users = users.filter((v, i, a) => a.indexOf(v) === i);
            users.forEach((usr)=> io.to(usr).emit(ev.event, ev))
        }
    }
}