const io = require("socket.io")({'pingTimeout': 1000, 'pingInterval': 2000})
const {events} = require("./dbops.js")
const app = require('../app')
const dbops = require('./dbops.js')
const {ObjectId} = require("mongodb");
const {generate_event} = require("./dbops");
const schema = require("../modules/schema");
const {Step} = require("prosemirror-transform");
const {doc_find, doc_set_content, doc_set} = require("../modules/dbops");

let memoryDocs = {}

/**
 *  Initializes the server socket.
 */
module.exports.init = function (server) {

    io.attach(server)

    // Maps every user to its list of connected sockets to server
    var connected_users = {}

    console.log("Connected users: ", connected_users)

    io.use(function (socket, next) {
        app.sessionMid(socket.request, {}, next);
    }).on("connection", async function (socket) {

        // New socket setup
        try {
            socket.request.session.passport.user.user_id
            ObjectId(socket.request.session.passport.user.user_id)
        } catch (err) {
            // User is not authenticated yet
            return
        }

        // USER IS AUTHENTICATED

        const userID = socket.request.session.passport.user.user_id;

        // Maps and keeps track of this socket relative to its authenticated users
        if (!connected_users[userID]) {
            connected_users[userID] = []
        }
        connected_users[userID].unshift(socket.id)
        //

        console.log("Connected users: ", connected_users)

        // Adds the user to his own personal user room, this way we can relay messages to every socket associated to a specific user
        socket.join("user:" + userID)

        socket.on('disconnect', function (socket) {
            console.log("[-] User ", userID, " disconnected")
            connected_users[userID].splice(connected_users[userID].indexOf(socket.id), 1)
            if (connected_users[userID].length === 0) {
                delete connected_users[userID]
            }
            console.log("Connected users: ", connected_users)
        })

        // Makes the socket monitor all of the documents associated with the user
        const docs = await dbops.docs_available(ObjectId(userID))
        docs.forEach(doc => {
            socket.join("document:" + doc._id.toHexString())
        })

        // Received when a socket wants to be kept updates on any events on a specific documents.
        //  Satisfies the socket's request only if the user is allowed to access the document in the first place.
        socket.on('subscribe_to_doc_events', async function (msg) {
            if (await dbops.isValidDocument(msg._id) && await dbops.isValidUser(userID) && (await dbops.user_get_perms(ObjectId(userID), ObjectId(msg._id))).length > 0) {
                console.log("Adding user to room ", "document:" + msg._id)
                socket.join("document:" + msg._id)
            }
        })


        //////////

        socket.on("doc-join-request", async function (msg) {
            if (await dbops.isValidUser(userID) && await dbops.isValidDocument(msg._id)) {
                const doc = await dbops.doc_find({_id: ObjectId(msg._id)});
                const perms = await dbops.user_get_perms(ObjectId(userID), ObjectId(msg._id))
                if (perms.length === 0) {
                    return
                }

                // Remove the sockets from all previous document rooms
                socket.rooms.forEach((room) => {
                    if (room.match(/^document:/)) {
                        socket.leave(room)
                    }
                })

                let documentID = msg._id;
                let permission = perms.includes("owner") ? "OWNER" :
                    perms.includes("edit") ? "EDIT" : "READ";

                // Makes the socket monitor just the state of the document in the editor.
                socket.join("document:" + msg._id)
                console.info(`SOCKETS User with ID ${userID} opened the document ${documentID} with permission ${permission}`);

                // Check if the document is already in memory
                if (!memoryDocs[documentID]) {
                    // Load the document from the db
                    memoryDocs[documentID] = {
                        doc: schema.nodeFromJSON(doc.content),
                        steps: [],
                        stepClientIDs: [],
                        connected: {}
                    }
                    console.info(`SOCKETS Document ${documentID} was loaded to memory`);
                }
                memoryDocs[documentID].connected[socket.id] = {
                    userID,
                    permission
                };

                async function save(doc) {
                    try {
                        const text = memoryDocs[documentID].doc.textContent;
                        const chars = text.length;
                        const charsNoSpaces = text.replaceAll(' ', '').length;

                        const words = text.replace(/[.,?!;()"'-]/g, " ")
                            .replace(/\s+/g, " ")
                            .split(" ").length;

                        await doc_set(new ObjectId(documentID), {
                            char_count: chars,
                            char_count_noSpaces: charsNoSpaces,
                            word_count: words,
                            content: memoryDocs[documentID].doc.toJSON()
                        })
                        console.log("AAAAAAAAAAAAAAA" + doc)
                        console.info(`SOCKETS Document ${documentID} was successfully saved`);
                        io.to(`document:${msg._id}/editor/write`).emit('save-success');
                    } catch (e) {
                        console.warn(`SOCKETS Document ${documentID} can't be saved: ` + e);
                        io.to(`document:${msg._id}/editor/write`).emit('save-fail', {error: e})
                    }
                }

                // Send document data to the client
                socket.emit("init", {
                    document: memoryDocs[documentID].doc.toJSON(),
                    permission,
                    version: memoryDocs[documentID].steps.length,
                    connected: memoryDocs[documentID].connected,
                });
                // Inform clients about new connection
                socket.broadcast.to(`document:${msg._id}/editor`).emit('client-connect', {
                    id: socket.id,
                    userID,
                    permission
                });

                if (permission === "OWNER" || permission === "EDIT") {
                    // If the user has edit access, it gets added to the reserved room for users with write access
                    socket.join(`document:${msg._id}/editor/write`)

                    socket.on('update', async ({version, steps, clientID}) => {
                        if (version !== memoryDocs[documentID].steps.length) return;

                        // This updates the server version of the document.
                        steps.forEach(stepJSON => {
                            let step = Step.fromJSON(schema, stepJSON);

                            memoryDocs[documentID].doc = (step.apply(memoryDocs[documentID].doc)).doc;
                            memoryDocs[documentID].steps.push(step);
                            memoryDocs[documentID].stepClientIDs.push(clientID);
                        })

                        // Save the document every 75 changes
                        if (memoryDocs[documentID].steps.length % 75 === 0) {
                            await save();
                        }

                        // Send changes
                        io.to(`document:${msg._id}/editor`).emit('update', {
                            version: memoryDocs[documentID].steps.length,
                            steps: memoryDocs[documentID].steps,
                            stepClientIDs: memoryDocs[documentID].stepClientIDs
                        });
                    })
                    socket.on('save', async (html) => {
                        await save(html);
                    })

                    socket.on('rename', async (newName) => {
                        try {
                            if (typeof newName !== 'string') {
                                socket.emit('rename-fail', {error: 'Title should be a string'});
                                return;
                            }
                            if (newName.length > 100 || newName.length < 1) {
                                socket.emit('rename-fail', {error: 'Length of the title must be between 1 and 100'})
                                return;
                            }
                            
                            await doc_set(new ObjectId(documentID), {title: newName}, false);
                            io.to(`document:${msg._id}/editor`).emit('rename-success', {newName});
                        } catch (e) {
                            socket.emit('rename-fail', {error: 'Unknown error: ' + e});
                        }
                    })

                    socket.on('selection-changed', ({from, to}) => {
                        memoryDocs[documentID].connected[socket.id].selection = {
                            from,
                            to
                        }
                        io.to(`document:${msg._id}/editor/write`).emit('selection-changed', memoryDocs[documentID].connected);
                    })
                }
                // The socket also gets added to the regular editor room, where everyone that is currently in the editor joins.
                socket.join(`document:${msg._id}/editor`)

                // Extended disconnect logic for the document editor
                socket.on('disconnect', async () => {
                    delete memoryDocs[documentID].connected[socket.id]
                    io.to(`document:${msg._id}/editor`).emit('client-disconnect', socket.id);

                    // Clean the memory, if no one is connected
                    if (Object.values(memoryDocs[documentID].connected).length === 0) {
                        console.info(`SOCKETS Document with ID ${documentID} is not opened by anyone anymore, it will be removed from the memory`);
                        await save();
                        delete memoryDocs[documentID];
                    }
                })

                // console.log(socket.rooms)
            }
        })
    });

    // Relays the database change to every related socket.
    events.on("db-event", async ev => {
        // console.log(ev)
        if (ev.subject.type === "document") {
            if (ev.type === "add") {  // If a new document has been added, manually notifies every involved user.
                await manually_relay_to_involved_users(ev.subject._id, ev)
            } else { // Otherwise updates every socket in the document's room.
                console.log("Sending back to room ", "document:" + ev.subject._id)
                io.to("document:" + ev.subject._id).emit(ev.event, ev)
            }
        } else if (ev.subject.type === "user") {
            // Events regarding user data
            // TODO: To be tested
            const userId = ev.subject._id
            if (await dbops.isValidUser(userId)) {
                const docs = await dbops.docs_available(ObjectId(userId))
                docs.reduce((io, doc) => {
                    return io.to("document" + doc._id.toHexString())
                }, io.to("user:" + userId)).emit(ev.event, ev)
            }
        }

        // Handles event in case the permissions change
        if (ev.subject.type === "document" && ev.type === "change" && (ev.data.perm_read || ev.data.perm_edit || ev.data.perm_read_add || ev.data.perm_read_remove || ev.data.perm_edit_add || ev.data.perm_edit_remove || ev.data.owner)) {
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
        if (await dbops.isValidDocument(doc_id)) {
            const doc = await dbops.doc_find({_id: ObjectId(doc_id)})
            var users = []
            users.push("user:" + doc.owner.toHexString())
            doc.perm_read.forEach(usr => {
                users.push("user:" + usr.toHexString())
            })
            doc.perm_edit.forEach(usr => {
                users.push("user:" + usr.toHexString())
            })
            users = users.filter((v, i, a) => a.indexOf(v) === i);
            users.forEach((usr) => io.to(usr).emit(ev.event, ev))
        }
    }


    async function update_socket_permissions(doc_id) {
        const doc = await dbops.doc_find({_id: ObjectId(doc_id)}, {"owner": 1, "perm_read": 1, "perm_edit": 1})
        if (!doc)
            return

        var perm_editors = []
        var perm_readers = []

        doc.owner = doc.owner.toHexString()
        doc.perm_edit = doc.perm_edit.map(el => el.toHexString())
        doc.perm_read = doc.perm_read.map(el => el.toHexString())

        perm_editors.push(doc.owner, ...doc.perm_edit)
        perm_readers.push(perm_editors, ...doc.perm_read)

        perm_editors = perm_editors.filter((v, i, a) => a.indexOf(v) === i);
        perm_readers = perm_readers.filter((v, i, a) => a.indexOf(v) === i);

        var socket_docs = io.sockets.adapter.rooms.get('document:' + doc_id) || new Set([])
        var socket_editors = io.sockets.adapter.rooms.get('document:' + doc_id + "/editor") || new Set([])
        var socket_editorwriters = io.sockets.adapter.rooms.get('document:' + doc_id + "/editor/write") || new Set([])


        var sockets = new Set([...socket_docs,
            ...socket_editors,
            ...socket_editorwriters])

        sockets.forEach(socket => {
            let user_id = get_user_from_socket(socket)
            if (!user_id)
                return

            if (!perm_readers.includes(user_id)) {
                // Removes the rooms in the socket's joined rooms Set.
                io.sockets.adapter.sids.get(socket).delete('document:' + doc_id)
                socket_docs.delete(socket)
                io.sockets.adapter.sids.get(socket).delete('document:' + doc_id + "/editor")
                socket_editors.delete(socket)
                io.sockets.adapter.sids.get(socket).delete('document:' + doc_id + "/editor/write")
                socket_editorwriters.delete(socket)

                io.to("user:" + user_id).emit('notify-update', generate_event("notify-update", "unavailable", {
                    type: "document",
                    _id: doc_id
                }, {message: "no-read"}))
            } else if (!perm_editors.includes(user_id)) {
                io.sockets.adapter.sids.get(socket).delete('document:' + doc_id + "/editor/write")
                socket_editorwriters.delete(socket)

                io.to("user:" + user_id).emit('notify-update', generate_event("notify-update", "unavailable", {
                    type: "document",
                    _id: doc_id
                }, {message: "no-edit"}))
            }
        })


        // TODO: Handle ADDITION of user permissions

    }

    function get_user_from_socket(socket_id) {
        Object.keys(connected_users).forEach(usr => {
            if (connected_users[usr].includes(socket_id))
                return usr
        })
    }
}