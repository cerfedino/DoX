function init_documents() {
    console.log(document.querySelectorAll(".card.document .delete-doc"))
    document.querySelectorAll("form.delete-doc").forEach(x=>x.addEventListener('submit',function(e) {
        e.preventDefault()
        fetch(this.action,
            {
                method: this.getAttribute('_method'),
                headers: {  "Accept":"application/json"},
            })
    }))
    document.querySelector("#dark-mode-toggle").addEventListener('change',
        function() {
            if(this.checked)
                document.body.classList.add("dark-theme")
            else
                document.body.classList.remove('dark-theme')
        });
}