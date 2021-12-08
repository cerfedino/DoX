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
    
    document.querySelectorAll('a[rel="del"]').forEach(x=>x.addEventListener('click',function(event){
        event.preventDefault();

        fetch(this.href,
            {
                method: this.getAttribute('_method'),
                headers: {  "Accept":"application/json"},
            })
    }))

    document.querySelector('.switch-list-grid').querySelectorAll('a').forEach(x=>x.addEventListener('click',function(event){
        event.preventDefault();

        if (!this.classList.contains('active')){
            let deactivate = document.querySelector('a.active').classList.contains('list-view') ? ".list" : ".grid";
            let activate = document.querySelector('a.active').classList.contains('list-view') ? ".grid" : ".list";
            document.querySelector("section"+deactivate).style.display = 'none';
            document.querySelector('a.active').classList.remove('active');
            document.querySelector("section"+activate).style.display = 'grid';
            this.classList.add('active');
        }
    }))

    document.querySelectorAll('.list-element').forEach(doc=>{
        if (!doc.classList.contains('head')){
            doc.querySelectorAll('.info').forEach(function(i){
                
                i.addEventListener('click',function(event){
                    if (!this.classList.contains('perms')){
                        let parts = doc.querySelector('a[rel="del"]').href.split('/');
                        let id = parts[parts.length - 1];
                        
                        window.location = doc.querySelector('a[rel="del"]').href;
                    }
                })
            })
        } else {
            doc.querySelectorAll('a').forEach(a=>a.addEventListener('click',function(event){
                event.preventDefault();
                // TODO - implement sort
            }))
        }
    })
    
    document.querySelectorAll('.owner').forEach(x=>{
        let filter = {_id: x.innerHTML};
        // TODO - add a route to know the email of a document owner
        fetch('docs/owner/'+filter._id)
        .then(email=>{
            x.innerHTML = email;
        })
    })
    
    // document.querySelector("#send_put").addEventListener('submit',function(e){
    //     e.preventDefault();
        
    //     fetch(`/docs/61ace214b83303c3053efa7a`,{
    //         method: "PUT",
    //         headers: {  "Content-Type":"application/json"},
    //         body: JSON.stringify({tags: {
    //             title: "ALBERT",
    //             // perm_edit_remove: ['61ace1efb83303c3053efa78'],
    //             // perm_read: [],
    //             owner: "61ace1efb83303c3053efa78" // Albert
    //             // owner: '61ace20fb83303c3053efa79' // Ale
    //         }})
    //     });
    // })

    document.querySelectorAll(".svgimgform").forEach(btn => {
        btn.addEventListener("click", deletecard)
    })

    function deletecard(e) {
        let id = e.target.parentNode.id;
        fetch(id, {
            method: "DELETE"
        }).then(res => {
            console.log(res.status);
            e.target.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        })
    }
}