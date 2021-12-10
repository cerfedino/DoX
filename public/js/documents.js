let base_documents = []; // Array containing all the documents of the page (without filter)
// let filteredDocuments = [];
// let searchDocuments = [];
let call = false;

function init_documents() {

    setSearchListener();

    setDeleteListeners();

    setSwitchButtonListener();
    
    setEditListeners();

    setEditReadUsernames();

    setOwnersUsernames();

    setFilterRowClick();

    setSaveListeners();

    setBaseDocuments();

    setToolBarSortListeners();

    setSortListeners();

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

// Set search listener on any input to search between all the titles and owners
function setSearchListener() {
    let search = document.getElementById('search');
    search.oninput = function(){
        
        // First we clean the section
        let list = document.querySelector('section#table-of-documents');
        document.querySelectorAll('.card-element').forEach(doc=>{
            list.removeChild(doc);
        })

        // Then we add back every actual row
        /* filteredDocuments */base_documents.forEach(row=>{
            list.innerHTML += row.outerHTML;
        })

        // searchDocuments = [];

        let text = search.value;
        document.querySelectorAll('.card-element').forEach((row)=>{
            debugger
            let owner = row.querySelector('.info.owner').innerHTML;
            let title = row.querySelector('.title').innerHTML;
            if (!title.includes(text) && !owner.includes(text)) {
                row.remove();
            }/*  else {
                searchDocuments.push(row);
            } */
        });

        document.querySelector('input[name="filter-submit"]').click();
    };

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
    document.querySelectorAll('.card-element').forEach(row=>{
        row.childNodes.forEach(el=>{
            if (el.classList != undefined && !el.classList.contains('delete')){
                el.addEventListener('click',function(event){
                    window.location = row.querySelector('a#icon').href;
                })
            }
        })
    })
}

// Sets the tool bar sort listeners so that they act as the headline's buttons of the table
function setToolBarSortListeners() {
    let row = document.querySelector('.list-element.head');

    let elements = document.querySelector('.dropdown.sort');
    elements.querySelectorAll('.dropdown-item').forEach(item=>{
        item.addEventListener('click',function(event){
            event.preventDefault();
            let className = item.getAttribute('rel');
            row.querySelector(`a[rel="${className}"]`).click();
        });
    })
}

// Set sort on click over buttons in the head line of the list
function setSortListeners() {

    let row = document.querySelector('.list-element.head');

    row.querySelectorAll('a').forEach(a=>a.addEventListener('click',function(event){
        event.preventDefault();

        let type;
        let action = a.getAttribute('rel');
        if (action.endsWith('-date')) {
            type = ".actual-" + action;
        } else {
            type = '.' + action;
        }

        debugger
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
        let list = document.querySelector('section#table-of-documents');
        document.querySelectorAll('.card-element').forEach(doc=>{
            documents_rows.push(doc);
            list.removeChild(doc);
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
        setSortListeners();
        // setDocumentListeners();
    }))
}

// Returns the username matching the given User's Id
function getUsernameById(id){
    return new Promise((resolve,reject)=>{
        let filter = {_id: id};
        fetch('/users/'+filter._id)
        .then(res=>res.json())
        .then(user=>{
            if (user.username == document.querySelector('#info > h2').innerHTML) {
                resolve("me");
            } else {
                resolve(user.username);
            }
        })
        .catch(err=>{
            reject("invalid user");
        });
        
    })
}

// Sets the username matching the given User's Id in the given DOM element
function setUsernameById(dom, id){
    return new Promise((resolve,reject)=>{
        getUsernameById(id)
        .then(username=>{
            dom.innerHTML = username;
            resolve(dom);
        })
        .catch(username=>{
            dom.innerHTML = username;
            resolve(dom);
        })
    })
}

// Set usernames instead of Ids in the permissions section of the document
function setEditReadUsernames() {
    document.querySelectorAll('a[data-title="Shared with"]').forEach(el=>{
        let articles = document.createElement('SECTION');
        articles.innerHTML = el.getAttribute('data-content');
        let promises = [];
        articles.querySelectorAll('.dropdown-item').forEach(item=>{
            let parts = item.innerHTML.split(' ');
            let i = 0;
            while(parts[i] != 'edit' && parts[i] != 'read' && parts[i] != 'Document') {
                i++;
            }
            if (parts[i+1] != 'not' && parts[i+2] != 'shared') {
                promises.push(new Promise((resolve,reject)=>{
                    setUsernameById(item,parts[i-1])
                    .then((dom)=>{
                        item = dom;
                        item.innerHTML += ' ' + parts[i];
                        resolve();
                    })
                }))
            }
        })
        Promise.all(promises)
        .then(()=>{  
            el.setAttribute('data-content',articles.innerHTML);
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
        if (call == false){
            call = true;
            document.getElementById('search').oninput();
            call = false;
        }

        // First reset the whole page so that the filters are all reapplied
        let toBeReseted = [];
        let list = document.getElementById('table-of-documents');
        list.childNodes.forEach(child=>{
            if (child.classList != undefined && !child.classList.contains('head')) {
                toBeReseted.push(child);
            }
        })
        let actualList = document.querySelectorAll('.card-element');

        toBeReseted.forEach(doc=>{
            list.removeChild(doc);
        })

        actualList.forEach(doc=>{
            list.innerHTML += doc.outerHTML;
        })

        setDocumentListeners();
        setSortListeners();

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

        /* filteredDocuments = [];
        document.querySelectorAll('.card-element').forEach(row=>{
            filteredDocuments.push(row);
        }) */
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
    document.querySelectorAll('.card-element').forEach(el=>{
        if (!el.classList.contains('head')){
            rows.push(el);
        }
    })
    let type = checkbox.name.split('-')[1];
    if (type == 'owned'){
        rows.forEach(row=>{
            if (row.querySelector('.info.owner').innerHTML != 'me'){
                row.parentNode.removeChild(row);
            }
        })
    } else if (type == 'read' || type == 'edit'){
        rows.forEach(row=>{
            let articles = document.createElement('SECTION');
            articles.innerHTML = row.querySelector('a[data-title="Shared with"]').getAttribute('data-content');
            articles.querySelectorAll('.dropdown-item').forEach(item=>{
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
            let a = row.querySelector('a[data-title="Shared with"]');
            let n = parseInt(a.childNodes[0].nodeValue);
            if (n == 0) {
                row.parentNode.removeChild(row);
            }
        })
    }
}

// Set base documents variable
function setBaseDocuments() {
    base_documents = [];
    document.querySelectorAll('.card-element').forEach(el=>{
        base_documents.push(el);
        // filteredDocuments.push(el);
        // searchDocuments.push(el);
    })
}