function init_perm_modal() {
    const modal = document.querySelector("#shareModal")
    const search_Field = modal.querySelector("#perm_modal_search")


    modal.querySelectorAll("tbody tr.user").forEach(row=>setup_perm_row_listeners(row))

    search_Field.parentNode.addEventListener('submit', function (e) {
        e.preventDefault()

        fetch (`/users?username=${this.perm_modal_search.value}`, 
            {
            method: "GET",
            headers: { Accept:"application/json" }
            }).then(res => {return res.json()})
            .then(json => {
                const user_id = json._id;
                if(modal.querySelector(`span.user[data-id="${user_id}"]`)) {
                    return
                }
                var el = document.createElement('div')
                
                modal.querySelector("table.table tbody").insertAdjacentHTML("beforeend",
                `<tr class="user">
                    <td> <span class="user" data-id=${user_id}>${user_id}</span></td>

                    <td><select class="form-select" name="permission">
                        <option value="read" selected>read</option>
                        <option value="write">write</option>
                        <option value="noperm">remove user</option>
                            
                        </select></td>
                </tr>`)
                setup_perm_row_listeners(modal.querySelector("table.table tbody").lastChild)
                let ev = new Event("change")
                modal.querySelector("table.table tbody").querySelector("select.form-select").dispatchEvent(ev)
            }).catch((e)=>{console.log(e)})
    })



    function setup_perm_row_listeners(tr) {
        console.log(tr)
        tr.querySelector("select.form-select").addEventListener("change",function(e) {
            console.log(this.value)
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
                    tags.perm_read_add = [user_id]
                    break;
            }
            console.log(tags)

            fetch(`/docs/${doc_id}`, {
                    method: "PUT",
                    headers: {  "Content-Type":"application/json"},
                    body: JSON.stringify({tags: tags})
                });
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