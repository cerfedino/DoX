function init_login() {

    // const form = document.querySelector(".login-form form")

    // // Submission of the LOGIN form
    // form.addEventListener("submit",function(e){
    //     e.preventDefault()

    // //     // Check for invalid fields
    // //     // const mistakes = validateForm(this)
    // //     // if(mistakes) {
    // //     //     showAlert(document.querySelector(".form-alerts.top"),"danger",mistakes,false)
    // //     //     return
    // //     // }
    // //     // //

    //     fetch(this.action,
    //         {
    //             method: this.method,
    //             credentials: "include",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({username, password})
    //         })
    //     .then(res => {return res.json()})
    //     .then(console.log)
    //     {return fetch('/docs', {method : "GET", headers: {  "Accept":"application/json"}})})
    //     .then(res => {return res.text()})
    //     .then(json => {
    //             console.log(json)

    //             if(json.success) {
    //                 window.location = "/docs";
    //             }
    //             // if(true) { // TODO: If auth successful
    //             //     window.location = "/docs"
    //             // } else {
    //             //     // Display error message under form
    //             //     showAlert(document.querySelector(".form-alerts.top"),"warning","Login unsuccessful",false)
    //             // }
    //         })
    // })

    document.querySelector("#dark-mode-toggle").addEventListener('change',
        function() {
            if(this.checked)
                document.body.classList.add("dark-theme")
            else
                document.body.classList.remove('dark-theme')
        });
}