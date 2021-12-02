function init_register() {
    const form = document.querySelector(".login-form form")

    // Submission of the register form
    form.addEventListener("submit",function(e) {
        e.preventDefault()

        // Check for invalid fields
        const mistakes = validateForm(this)
        if(mistakes) {
            showAlert(document.querySelector("#alerts"),"warning",mistakes,false)
            return
        }
        //

        console.log(this.method, this.action)
        fetch(this.action,
            {
                method: this.method,
                headers: {
                    "Content-Type" : "application/json",
                    "Accept":"application/json"
                },
                body: JSON.stringify({
                    username: form.querySelector("input[name='username']").value,
                    password: form.querySelector("input[name='password']").value,
                    email: form.querySelector("input[name='email']").value
                })
            }).then(res=>{return res.json()})
            .then(auth => {
                console.log("Auth response: ",auth)
                switch(auth.status) {
                    case "success": 
                        window.location = "/login"
                    break;
                    case "neutral":
                    case "fail":
                        showAlert(document.querySelector("#alerts"),auth.status=="neutral"?"primary":"danger",auth.message,false)
                        break;
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