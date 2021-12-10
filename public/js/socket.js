/**
 * Initializes the socket connection to the server.
 */

function init_socket(doc_id) {
    const server = io()
    server.on("connect",() => {
        console.log("[+] Connected to server")

        if(doc_id) {
            console.log(doc_id)
            // server.emit("doc-join-request",{doc_id:doc_id})
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
        })
    })


    function relay_event_on_body(server_socket_msg) {
        let ev = new Event("notify-update")
        ev.msg = msg
        document.body.dispatchEvent(ev)
    }

    return server
}
