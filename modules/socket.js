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

    io.on("connection", function (socket) {

        console.log("[+] User connected")

        socket.on('disconnect',function(socket) {
            console.log("[-] User disconnected")
        })
    });

    //// Relays the database change to every connected socket.
    // TODO: Relay only to who has permissions on the document.
    events.on("db-event", ev => {
        console.log("[+] Emitting event to all clients")
        io.emit(ev.event, ev)
    })
}