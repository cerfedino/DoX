const io = require("socket.io")({'pingTimeout':1000,'pingInterval': 2000})
const {events} = require("./dbops.js")
const app = require('../app')
const dbops = require('./dbops.js')
const {ObjectId} = require("mongodb");
const {generate_event} = require("./dbops");


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
        socket.on('subscribe_to_doc_events', async function (msg) {
            if(await dbops.isValidDocument(msg._id) && await dbops.isValidUser(userId) && (await dbops.user_get_perms(ObjectId(userId), ObjectId(msg._id))).length > 0) {
                console.log("Adding user to room ","document:"+msg._id)
                socket.join("document:"+msg._id)
            }
        })


        //////////

        socket.on("doc-join-request",async function (msg) {
            if (await dbops.isValidUser(userId) && await dbops.isValidDocument(msg._id)) {
                const perms = await dbops.user_get_perms(ObjectId(userId),ObjectId(msg._id))
                if(perms.length == 0) {
                    return
                }

                // Remove the sockets from all previous document rooms
                socket.rooms.forEach((room)=>{
                    if(room.match(/^document:/)) {
                        socket.leave(room)
                    }
                })
                //

                // Makes the socket monitor just the state of the document in the editor.
                socket.join("document:"+msg._id)
                if(perms.includes("edit") || perms.includes("owner")) {
                    // If the user has edit access, it gets added to the reserved room for users with write access
                    socket.join(`document:${msg._id}/editor/write`)
                }
                // The socket also gets added to the regular editor room, where everyone that is currently in the editor joins.
                socket.join(`document:${msg._id}/editor`)


                // console.log(socket.rooms)
            }
        })
    });

    // Relays the database change to every related socket.
    events.on("db-event", async ev => {
        // console.log(ev)
        if(ev.subject.type == "document") {
            if(ev.type == "add") {  // If a new document has been added, manually notifies every involved user.
                await manually_relay_to_involved_users(ev.subject._id, ev)
            } else { // Otherwise updates every socket in the document's room.
                console.log("Sending back to room ","document:"+ev.subject._id)
                io.to("document:"+ev.subject._id).emit(ev.event, ev)
            }
        } else if(ev.subject.type == "user") {
            // Events regarding user data
            // TODO: To be tested
            const userId = ev.subject._id
            if(await dbops.isValidUser(userId)) {
                const docs = await dbops.docs_available(ObjectId(userId))
                docs.reduce((io,doc)=>{return io.to("document"+doc._id.toHexString())},io.to("user:"+userId)).emit(ev.event, ev)
            }
        }

        // Handles event in case the permissions change
        if(ev.subject.type == "document" && ev.type == "change" && (ev.data.perm_read || ev.data.perm_edit || ev.data.perm_read_add || ev.data.perm_read_remove || ev.data.perm_edit_add || ev.data.perm_edit_remove || ev.data.owner)) {
            await update_socket_permissions(ev.subject._id)
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


    async function update_socket_permissions(doc_id) {
            const doc = await dbops.doc_find({_id:ObjectId(doc_id)}, {"owner":1,"perm_read":1,"perm_edit":1})
            if(!doc)
                return

            var perm_editors = []
            var perm_readers = []

            doc.owner = doc.owner.toHexString()
            doc.perm_edit = doc.perm_edit.map(el=>el.toHexString())
            doc.perm_read = doc.perm_read.map(el=>el.toHexString())

            perm_editors.push(doc.owner, ...doc.perm_edit)
            perm_readers.push(perm_editors, ...doc.perm_read)

            perm_editors = perm_editors.filter((v, i, a) => a.indexOf(v) === i);
            perm_readers = perm_readers.filter((v, i, a) => a.indexOf(v) === i);

            var socket_docs            = io.sockets.adapter.rooms.get('document:'+doc_id) || new Set([])
            var socket_editors         = io.sockets.adapter.rooms.get('document:'+doc_id+"/editor") || new Set([])
            var socket_editorwriters   = io.sockets.adapter.rooms.get('document:'+doc_id+"/editor/write")  || new Set([])


            var sockets = new Set([...socket_docs,
                                  ...socket_editors,
                                  ...socket_editorwriters])
            
            sockets.forEach(socket => {
                let user_id = get_user_from_socket(socket)
                if(!user_id)
                    return

                if(!perm_readers.includes(user_id)) {
                    // Removes the rooms in the socket's joined rooms Set.
                    io.sockets.adapter.sids.get(socket).delete('document:'+doc_id)
                    socket_docs.delete(socket)
                    io.sockets.adapter.sids.get(socket).delete('document:'+doc_id+"/editor")
                    socket_editors.delete(socket)
                    io.sockets.adapter.sids.get(socket).delete('document:'+doc_id+"/editor/write")
                    socket_editorwriters.delete(socket)

                    io.to("user:"+user_id).emit('notify-update', generate_event("notify-update","unavailable",{type:"document",_id:doc_id},{message:"no-read"}))
                } else if(!perm_editors.includes(user_id)) {
                    io.sockets.adapter.sids.get(socket).delete('document:'+doc_id+"/editor/write")
                    socket_editorwriters.delete(socket)

                    io.to("user:"+user_id).emit('notify-update', generate_event("notify-update","unavailable",{type:"document",_id:doc_id},{message:"no-edit"}))
                }
            })


            // TODO: Handle ADDITION of user permissions

    }

    function get_user_from_socket(socket_id) {
        Object.keys(connected_users).forEach(usr=>{
            if(connected_users[usr].includes(socket_id))
                return usr
        })
    }
}