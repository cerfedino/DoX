function init_login() {
    const form = document.querySelector(".login-form form")

    form.addEventListener("submit",function(e){
        e.preventDefault()
        // TODO: Send login fields to POST /auth
        // fetch(form.action,
        //     {method:"POST"
        //     })


        // TODO: Remove after demo
        window.location = "/docs"
    })
}