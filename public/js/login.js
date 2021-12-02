function init_login() {

    // const form = document.querySelector(".login-form form")
  
    // Submission of the LOGIN form
    // form.addEventListener("submit",function(e){
    //     e.preventDefault()

    //     // Check for invalid fields
    //     const mistakes = validateForm(this)
    //     if(mistakes) {
    //         showAlert(document.querySelector(".form-alerts.top"),"danger",mistakes,false)
    //         return
    //     }
    //     //

    //     fetch(this.action,
    //         {
    //             method: this.method,
    //             headers: {  "Accept":"application/json"},
    //             body: new FormData(this)
    //         }).then(res=>{return res.json()})
    //         .then(res => {
    //             if(true) { // TODO: If auth successful
    //                 window.location = "/docs"
    //             } else {
    //                 // Display error message under form
    //                 showAlert(document.querySelector(".form-alerts.top"),"warning","Login unsuccessful",false)
    //             }
    //         })
    // })

    /**
     * Validates the form input fields and returns and returns an unordered list of errors.
     * @returns {string} unordered list containing a list of errors, or the empty string if the form fields are all valid.
     */
    function validateForm() {
        var mistakes = ""

        const username = form.querySelector("input#username").value.trim()
        const pwd = form.querySelector("#password").value.trim()

        if(username === "") {
            mistakes += "<li> Username cannot be empty </li>"
        }
        if (pwd === "") {
            mistakes += "<li> Username cannot be empty </li>"
        }
        return mistakes ? `Please fix the following:<ul>${mistakes}</ul>` : "";
    }
}