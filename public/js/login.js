function init_login() {
    const form = document.querySelector(".login-form form")

    form.addEventListener("submit",function(e){
        e.preventDefault()
        // TODO: Send login fields to POST /auth
        const mistakes = validateForm(this)
        if(mistakes) {
            showAlert(document.querySelector(".form-alerts.top"),"danger",mistakes,false)
            return
        }

        fetch(this.action,
            {
                method: this.method,
                headers: {  "Accept":"application/json"},
                body: new FormData(this)
            }).then(res=>{return res.json()})
            .then(res => {
                if(true) { // TODO: If auth successful
                    window.location = "/docs"
                } else {
                    // Display error message under form
                    showAlert(document.querySelector(".form-alerts.top"),"warning","Login unsuccessful",false)
                }
            })
    })

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
        return mistakes? `Please fix the following:<ul>${mistakes}</ul>` : undefined;
    }

    document.querySelector("#dark-mode-toggle").addEventListener('change',
        function() {
            if(this.checked)
                document.body.classList.add("dark-theme")
            else
                document.body.classList.remove('dark-theme')
        });
}