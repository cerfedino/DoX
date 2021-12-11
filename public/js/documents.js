function init_documents() {
    // Delete document button on every document card.
    document.querySelectorAll("form.delete-doc").forEach(x => x.addEventListener('submit',function(e) {
        e.preventDefault()
        // Sends DELETE request for the document
        fetch(this.action,
            {
                method: this.getAttribute('_method'),
                headers: {  "Accept":"application/json"},
            })
    }))
    
    document.querySelector("#send_put")?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        fetch(`/docs/61b3715dac6467bae143ec95`, {
            method: "PUT",
            headers: {  "Content-Type":"application/json"},
            body: JSON.stringify({tags: {
                // title: "ALBERT"
                perm_edit_add: ['61af47e2616d891f68b69aab'],
                // perm_read: [],
                // owner: "61ace1efb83303c3053efa78" // Albert
                // owner: '61ace20fb83303c3053efa79' // Ale
            }})
        });
    })


}