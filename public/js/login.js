function init_login() {

    const form = document.querySelector(".login-form form")
  
    // Submission of the LOGIN form
    form.addEventListener("submit",function(e){
        e.preventDefault()

        // Check for invalid fields
        const mistakes = validateForm(this)
        if(mistakes) {
            // showAlert(document.querySelector("#alerts"),"warning",mistakes,false)
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
                    password: form.querySelector("input[name='password']").value
                })
            }).then(res=>{return res.json()})
            .then( auth => {
                console.log("Auth response: ",auth)
                switch(auth.status) {
                    case "success": 
                        window.location = "/docs"
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
    function validateForm() {
        var mistakes = false

        const username = form.querySelector("input#username").value.trim()
        const pwd = form.querySelector("#password").value.trim()

        if(username === "") {
            showAlert(document.querySelector("#alerts"),"warning","Username cannot be empty",true)
            mistakes = true;
        }
        if (pwd === "") {
            showAlert(document.querySelector("#alerts"),"warning","Password cannot be empty",true)
            mistakes = true;
        }
        return mistakes;
    }
}