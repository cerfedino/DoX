function init_register() {
    const form = document.querySelector(".login-form form")

    form.addEventListener("submit",function(e){
        e.preventDefault()
        // TODO: Send register fields to POST /auth/register
        // fetch(form.action,
        //     {method:"POST"
        //     })


        // TODO: Remove after demo
        window.location = "/login"
    })
}