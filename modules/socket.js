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

    var connected_users = {}

    console.log("Connected users: ",connected_users)

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

        if(!connected_users[userId]) {
            connected_users[userId] = []
        }
        connected_users[userId].unshift(socket.id)
        console.log("Connected users: ",connected_users)

        socket.on('disconnect',function(socket) {
            console.log("[-] User ", userId, " disconnected")
            connected_users[userId].splice(connected_users[userId].indexOf(socket.id),1)
            console.log("Connected users: ",connected_users)
        })
    });

    //// Relays the database change to every connected socket.
    // TODO: Relay only to who has permissions on the document.
    events.on("db-event", ev => {
        console.log("[+] Emitting event to all clients")
        io.emit(ev.event, ev)
    })
}