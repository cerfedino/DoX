function init_perm_modal() {
    const modal = document.querySelector("#share-modal")













    document.querySelector("#send_put").addEventListener('submit',function(e) {
        e.preventDefault();

        fetch(`/docs/61bdd01f09c954233e5fc137`,{
            method: "PUT",
            headers: {  "Content-Type":"application/json"},
            body: JSON.stringify({tags: {
                title: "ALBERT",
                perm_edit_add: ['61bdcff109c954233e5fc136'],
                // perm_read: [],
                // owner: "61ace1efb83303c3053efa78" // Albert
                // owner: '61ace20fb83303c3053efa79' // Ale
            }})
        });
    })
}