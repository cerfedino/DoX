function init_register() {
  
    const form = document.querySelector(".login-form form")

    // Submission of the register form
    form.addEventListener("submit",function(e) {
        e.preventDefault()

        // Check for invalid fields
        const mistakes = validateForm(this)
        if(mistakes) {
            showAlert(document.querySelector(".form-alerts.top"),"danger",mistakes,false)
            return
        }
        //

        fetch(this.action,
            {
                method: this.method,
                headers: {  "Accept":"application/json"},
                body: new FormData(this)
            }).then(res=>{return res.json()})
            .then(res => {
                if(true) {      // TODO: If register successful
                    window.location = "/login"
                } else {

                    // Display error message under form
                    showAlert(document.querySelector(".form-alerts.top"),"warning","Register unsuccessful",false)
                }
            })
    })

    /**
     * Validates the form input fields and returns and returns an unordered list of errors.
     * @returns {string} unordered list containing a list of errors, or the empty string if the form fields are all valid.
     */
    function validateForm(form) {
        var mistakes = ""

        const username = form.querySelector("input#username").value.trim()
        const pwd = form.querySelector("#newPassword").value
        const confirm_pwd = form.querySelector("#confirmPassword").value

        if(pwd !== confirm_pwd) {
            mistakes += "<li> Passwords are not matching </li>"
        }
        if (username === "") {
            mistakes += "<li> Username cannot be empty </li>"
        }
        return mistakes? `Please fix the following:<ul>${mistakes}</ul>` : "";
    }
}