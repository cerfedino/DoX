function init_documents() {

    // Delete document button on every document card.
    document.querySelectorAll("form.delete-doc").forEach(x=>x.addEventListener('submit',function(e) {
        e.preventDefault()
        // Sends DELETE request for the document
        fetch(this.action,
            {
                method: this.getAttribute('_method'),
                headers: {  "Accept":"application/json"},
            })
    }))

}