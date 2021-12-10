let base_documents = []; // Array containing all the documents of the page (without filter)

function init_documents() {

    setDeleteListeners();

    setSwitchButtonListener();
    
    setEditListeners();

    setEditReadUsernames();

    setOwnersUsernames();

    setFilterRowClick();    

    setSaveListeners();

    setBaseDocuments();

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

// Set all the listeners for a Document (row in list view)
function setDocumentListeners() {
    setEditListeners();
    setDeleteListeners();
}

// Set switch button between the list and grid view
function setSwitchButtonListener(){
    document.querySelector('.switch-list-grid a.grid-view').addEventListener('click', (event) => {
        event.preventDefault();

        document.getElementById("table-of-documents").className = "cards";
        document.querySelector('.switch-list-grid a.grid-view').style = "background-color: var(--bg-contrast); color: var(--accent)";
        document.querySelector(".switch-list-grid a.list-view").style = "background-color: var(--bg); color: var(--text)";

    })
    

    document.querySelector('.switch-list-grid a.list-view').addEventListener('click', (event) => {
        event.preventDefault();

        document.getElementById("table-of-documents").className = "list";
        document.querySelector('.switch-list-grid a.list-view').style = "background-color: var(--bg-contrast); color: var(--accent)";
        document.querySelector(".switch-list-grid a.grid-view").style = "background-color: var(--bg); color: var(--text)";

    })
    
    
    // querySelectorAll('a').forEach(x=>x.addEventListener('click',function(event){
    //     event.preventDefault();


    //     if (!this.classList.contains('active')){
    //         let deactivate = document.querySelector('a.active').classList.contains('list-view') ? ".list" : ".card";
    //         let activate = document.querySelector('a.active').classList.contains('list-view') ? ".card" : ".list";
    //         document.querySelector("section"+deactivate).style.display = 'none';
    //         document.querySelector('a.active').classList.remove('active');
    //         document.querySelector("section"+activate).style.display = 'flex';
    //         this.classList.add('active');
    //     }
    // }))
}

// Set both edit and delete listeners buttons
function setDeleteListeners() {
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

    // Set delete button on each document line (list view)
    document.querySelectorAll('a[rel="del"]').forEach(x=>x.addEventListener('click',function(event){
        event.preventDefault();

        fetch(this.href,
            {
                method: this.getAttribute('_method'),
                headers: {  "Accept":"application/json"},
            })
    }))
}

// Set list edit links for each document and sort links for the header buttons
function setEditListeners() {
    document.querySelectorAll('.list-element').forEach(row=>{
        if (!row.classList.contains('head')){
            row.querySelectorAll('.info').forEach(function(i){
                i.addEventListener('click',function(event){
                    if (!this.classList.contains('perms')){
                        /* let parts = row.querySelector('a[rel="del"]').href.split('/');
                        let id = parts[parts.length - 1]; */
                        window.location = row.querySelector('a[rel="del"]').href;
                    }
                })
            })
        } else {
            setSortListeners(row);
        }
    })
}

function setSortListeners(row) {
    row.querySelectorAll('a').forEach(a=>a.addEventListener('click',function(event){
        event.preventDefault();
        // TODO - discuss best implementations to have the array of html elements to then compose the section
        let type;
        if (a.innerHTML.includes('Date')) {
            type = ".actual-" + a.innerHTML.split(' ')[0].toLowerCase() + "-date";
        } else {
            type = '.' + a.innerHTML.toLowerCase();
        }

            // First, we take all the actual values
            let values = [];
            document.querySelectorAll(type).forEach(val=>{
                if (type.startsWith('.actual') && type.endsWith('-date')) {
                    values.push(new Date(val.innerHTML));
                } else {
                    values.push(val.innerHTML);
                }
            });

            // Then we get all the document rows and empty the section
            let documents_rows = [];
            let list = document.querySelector('section.list');
            document.querySelectorAll('.list-element').forEach(doc=>{
                if (!doc.classList.contains('head')) {
                    documents_rows.push(doc);
                    list.removeChild(doc);
                }
            })
            
            // TODO - merge new version
            /* let main = document.querySelector('main'); */

            // Finally we sort the values and for each of them place in the section the first node matching the value
            values.sort();
            values.forEach(val=>{
                let done = false;
                documents_rows.forEach(doc=>{
                    if (!done && doc != undefined && doc.querySelector(type).innerHTML == String(val)){
                        list.innerHTML += doc.outerHTML;
                        documents_rows = documents_rows.filter(x=>(x != doc));
                        done = true;
                    }
                })
            });
        
        setEditListeners();
        // setDocumentListeners();
    }))
}

// Sets the username matching the given User's Id in the given DOM element
function setUsernameById(dom, id){
    return new Promise((resolve,reject)=>{
        let filter = {_id: id};
        fetch('users/'+filter._id)
        .then(res=>res.json())
        .then(user=>{
            if (user.username == document.querySelector('#info > h2').innerHTML) {
                dom.innerHTML = "me";
            } else {
                dom.innerHTML = user.username;
            }
            resolve();
        })
        .catch(err=>{
            if (dom.innerHTML == ""){
                dom.innerHTML = "invalid user";
            }
            reject();
        });
        
    })
}

// Set usernames instead of Ids in the permissions section of the document
function setEditReadUsernames() {
    document.querySelectorAll('.perms').forEach(el=>{
        el.querySelectorAll('.dropdown-item').forEach(item=>{
            debugger
            let parts = item.innerHTML.split(' ');
            let i = 0;
            while(parts[i] != 'edit' && parts[i] != 'read' && parts[i] != 'Document') {
                i++;
            }
            if (parts[i+1] != 'not' && parts[i+2] != 'shared') {
                setUsernameById(item,parts[i-1])
                .then(()=>{
                    item.innerHTML += ' ' + parts[i];
                })
            }
        })
    })
}

// Set usernames instead of Ids in the owner section of the document
function setOwnersUsernames() {
    document.querySelectorAll('p.owner').forEach(x=>{
        let span = x.parentNode.querySelector('span.owner');
        setUsernameById(span,x.innerHTML);
    })
}

// Set selection for filters so that you can select a filter without having to go on the checkbox
function setFilterRowClick() {
    document.getElementById('filters').querySelectorAll('.dropdown-item').forEach(item=>{
        let checkbox = item.querySelector('input');
        item.addEventListener('click',function(event){
            checkbox.checked = !checkbox.checked;
        })

        // Set checkbox click so that it works even on itself
        checkbox.addEventListener('change',function(event){
            checkbox.checked = !checkbox.checked;
        })
    })
}

// Set listener for saving filters 
function setSaveListeners() {
    // Save filters sets all the selected filters
    document.querySelector('input[name="filter-submit"]').addEventListener('click',function(event){
        event.preventDefault();

        debugger
        // First reset the whole page so that the filters are all reapplied
        let toBeReseted = [];
        let list = document.querySelector('.list');
        list.childNodes.forEach(child=>{
            if (child.classList != undefined && !child.classList.contains('head')) {
                toBeReseted.push(child);
            }
        })

        toBeReseted.forEach(doc=>{
            list.removeChild(doc);
        })

        base_documents.forEach(doc=>{
            list.innerHTML += doc.outerHTML;
        })

        setDocumentListeners();

        document.getElementById('filters').querySelectorAll('input[type="checkbox"]').forEach(checkbox=>{
            let active = document.querySelector('.active-filters');
            let item = checkbox.parentNode.querySelector('label[for="' + checkbox.name + '"]');
            if (checkbox.checked == true){
                if (active.querySelector('.active-filter.' + checkbox.name) == null) {
                    let button = document.createElement('BUTTON');
                    button.classList.add('active-filter');
                    button.classList.add(checkbox.name);
                    button.innerHTML = item.innerHTML + " X";
                    active.appendChild(button);
                }
                setActiveFilter(checkbox);
            } else {
                let btn = active.querySelector('.' + checkbox.name);
                if (btn != null) {
                    active.removeChild(btn);
                }
            }
        })
    })
}

/**
 * setActiveFilter sets the filter corresponding to the given checkbox
 * @param {HTMLElement} checkbox the checkbox filter
 */
function setActiveFilter(checkbox){
    if (checkbox.type != 'checkbox') {
        return undefined;
    }

    let rows = [];
    document.querySelectorAll('.list-element').forEach(el=>{
        if (!el.classList.contains('head')){
            rows.push(el);
        }
    })
    debugger
    let type = checkbox.name.split('-')[1];
    if (type == 'owned'){
        rows.forEach(row=>{
            if (row.querySelector('.info.owner').innerHTML != 'me'){
                row.parentNode.removeChild(row);
            }
        })
    } else if (type == 'read' || type == 'edit'){
        rows.forEach(row=>{
            row.querySelectorAll('.perms > .dropdown-menu > .dropdown-item').forEach(item=>{
                let parts = item.innerHTML.split(' ');
                let i = 0;
                while (parts[i] != 'read' && parts[i] != 'edit' && parts[i] != 'Document') {
                    i++;
                }
                if (parts[i] != type || parts[i-1] != 'me'){
                    row.parentNode.removeChild(row);
                }
            })
        })
    } else {
        rows.forEach(row=>{
            let parts = row.querySelector('.dropdown-toggle').innerHTML.split(' ');
            let i = 0;
            while (parts[i] != 'with') {
                i++;
            }
            i++;
            let n = parts[i];
            if (n == 0) {
                row.parentNode.removeChild(row);
            }
        })
    }
}

// Set base documents variable
function setBaseDocuments() {
    base_documents = [];
    document.querySelectorAll('.list-element').forEach(el=>{
        if (!el.classList.contains('head')) {
            base_documents.push(el);
        }
    })
}