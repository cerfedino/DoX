/**
 * Initializes the socket connection to the server.
 */

function init_socket(doc_id) {
    const server = io()
    server.on("connect",() => {
        console.log("[+] Connected to server")

        // If the socket has to join a document editor room. To be used only when opening the editor for a document.
        if(doc_id) {
            console.log(doc_id)
            // server.emit("doc-join-request",{doc_id:doc_id})
        } else {
            server.on("notify-update",(msg) => {
                if(msg.type == "add" && msg.subject.type == "document") { // If a new document concerning this user has been added
                    // Ask the server to keep updating this socket on any changes on the newly created document, if allowed
                    server.emit("subscribe_to_doc_events",{_id : msg.subject._id})
                }
            })
        }

        // Handle connection/disconnection
        document.body.classList.remove("disconnected")
        server.on("disconnect",() => {
            console.log("[-] Disconnected from server")
            document.body.classList.add("disconnected")
        })
        /////

        // When getting a notify-update from the server, dispatches the same exact event on the body
        //  any DOM element that is interested in these events can add his own listener for it on the body and handle it.
        server.on("notify-update",(msg) => {
            console.log(msg)
            relay_event_on_body(msg)
        })
    })


    function relay_event_on_body(server_socket_msg) {
        let ev = new Event(server_socket_msg.event)
        ev.msg = server_socket_msg
        document.body.dispatchEvent(ev)
    }

    return server
}
