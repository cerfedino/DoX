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

    io.use(function (socket, next) {
        app.sessionMid(socket.request, {}, next);
    }).on("connection", async function (socket) {

        try {
            socket.request.session.passport.user.user_id
            ObjectId(socket.request.session.passport.user.user_id)
        } catch(err) {
            // User is not authenticated yet
            return
        }

        const userId = socket.request.session.passport.user.user_id;

        socket.on('disconnect',function(socket) {
            console.log("[-] User ", userId, " disconnected")
        })
    });

    //// Relays the database change to every connected socket.
    // TODO: Relay only to who has permissions on the document.
    events.on("db-event", ev => {
        console.log("[+] Emitting event to all clients")
        io.emit(ev.event, ev)
    })
}