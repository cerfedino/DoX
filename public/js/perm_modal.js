function init_perm_modal() {
    const modal = document.querySelector("#shareModal")
    const search_Field = modal.querySelector("#perm_modal_search")

    modal.querySelectorAll("tbody span.user").forEach(userDOM => {
        let id = userDOM.innerHTML;
        fetch('/users/' + id)
        .then(res=>res.json())
        .then(user=>{
            if (user.username == document.querySelector('#info > h2').innerHTML) {
                userDOM.innerHTML = "<i>me</i>";
            } else {
                userDOM.innerHTML = user.username;
            }
        })
        .catch(err=>{
            // invalid user;
        });
    })

    modal.querySelectorAll("tbody tr.user").forEach(row=>{setup_perm_row_listeners(row)})

    // console.log("AAAAAAAAAAAAAAAAAAAAAA" + userid + "BBBBBBBBBBBBBBB" + doc)
    // modal.querySelectorAll("tbody tr.user").forEach(row=>{setup_perm_row_listeners(row)})

    search_Field.parentNode.addEventListener('submit', function (e) {
        e.preventDefault()

        const username = this.perm_modal_search.value;

        fetch (`/users?username=${username}`, 
            {
            method: "GET",
            headers: { Accept:"application/json" }
            }).then(res => {return res.json()})
            .then(json => {
                const user_id = json._id;
                if(modal.querySelector(`span.user[data-id="${user_id}"]`)) {
                    show_error_message("already shared with")
                    return
                }
                var el = document.createElement('div')
                
                modal.querySelector("table.table tbody").insertAdjacentHTML("beforeend",
                `<tr class="user">
                    <td> <span class="user" data-id=${user_id}>${username}</span></td>

                    <td>
                        <select class="form-select" name="permission">
                            <option value="read" selected>read</option>
                            <option value="edit">write</option>
                            <option value="noperm">remove user</option> 
                        </select>
                    </td>
                </tr>`)
                this.perm_modal_search.value = '';
                setup_perm_row_listeners(modal.querySelector("table.table tbody").lastChild)
                let ev = new Event("change")
                modal.querySelector("table.table tbody").lastChild.querySelector("select.form-select").dispatchEvent(ev)
            }).catch((e)=>{
                show_error_message();
            })
    })


    function show_error_message(msg = 'Username does not exists') {
        const error_message = document.querySelector("#shareModal #no_user")
        error_message.innerHTML = msg;
        error_message.hidden = false;
        setTimeout(() => {
            error_message.hidden = true;
        }, 5000);
    }

    function setup_perm_row_listeners(tr) {
        tr.querySelector("select.form-select").addEventListener("change",function(e) {
            const user_id = tr.querySelector("span.user").dataset.id;
            const doc_id = documentID;
            let tags = {}
            switch(this.value) {
                case "noperm":
                    tags.perm_edit_remove = [user_id]
                    tags.perm_read_remove = [user_id]
                    break;
                case "read":
                    tags.perm_edit_remove = [user_id]
                    tags.perm_read_add = [user_id]
                    break;
                case "edit":
                    tags.perm_edit_add = [user_id]
                    break;
            }

            fetch(`/docs/${doc_id}`, {
                    method: "PUT",
                    headers: { "Content-Type":"application/json"},
                    body: JSON.stringify({tags: tags})
                }).then(res => {
                    if (res.status == 200 && this.value == "noperm") {
                        this.parentNode.parentNode.remove();
                    }
                })
        })
    }

    // document.querySelector("#send_put").addEventListener('submit',function(e) {
    //     e.preventDefault();
    //     fetch(`/docs/61bdf63d46f0489c6cb95db8`,{
    //         method: "PUT",
    //         headers: {  "Content-Type":"application/json"},
    //         body: JSON.stringify({tags: {
    //             title: "PropertyOfAlbert",
    //             perm_edit_remove: ['61bdcff109c954233e5fc136'],
    //             // perm_read: [],
    //             // owner: "61ace1efb83303c3053efa78" // Albert
    //             // owner: '61ace20fb83303c3053efa79' // Ale
    //         }})
    //     });
    // })
}