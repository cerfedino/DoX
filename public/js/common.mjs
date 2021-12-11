/**
 * Contains declarations to be used across the site.
 */

/**
 * Generates a new Bootstrap alert and inserts it into the container element.
 * @param {HTMLElement} container the HTML element to put the newly generated alert in.
 * @param {String} alert_type the type of the warning, in the Bootstrap 4 specification the allowed values are:
 *  "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark"
 * @param {String=""} text the text body of the alert.
 * @param {boolean=true} append whether to append the alert to the container element or
 *  to remove all previous alerts first.
 * @param {boolean=true} auto_dismiss true to auto dismiss the alert, false otherwise
 */
function showAlert(container, alert_type="warning", text="", append=true, auto_dismiss=true) {
    const alert =
        `<div class="alert alert-${alert_type} alert-dismissible fade show" role="alert">
              ${text}
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>`
        
    if(append) {
        container.insertAdjacentHTML("afterbegin",alert)
    } else {
        container.innerHTML = alert
    }
    if (auto_dismiss) {
        setTimeout(function() {
            $(".alert").alert('close');
        }, 8000);
    }
}


if (sessionStorage.getItem("dark_mode") == 'true') {
    document.body.classList.add("dark-theme")
    document.querySelector("#dark-mode-toggle").checked = true
} else {
    document.body.classList.remove('dark-theme')
    document.querySelector("#dark-mode-toggle").checked = false
}
// Dark-theme toggle
document.querySelector("#dark-mode-toggle")?.addEventListener('change',
    function() {
        if(this.checked) {
            document.body.classList.add("dark-theme");
            sessionStorage.setItem("dark_mode", 'true');
        } else {
            document.body.classList.remove('dark-theme');
            sessionStorage.setItem("dark_mode", 'false');
        }
    });





// Edit user modal form

let form = document.querySelector(".modal-body form")
  
form.addEventListener("submit",function(e){
    

    const mistakes = validateForm(this);
    if(mistakes) {
        return
    }

    fetch(this.action, {
        method: this.method,
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify({
            username: form.querySelector("input[name='username']").value, 
            password: form.querySelector("input[name='password']").value
        })
    })
})

function validateForm(form) {
    var mistakes = false

    const username = form.querySelector("#username").value.trim()
    console.log("USERNAME :" + username)
    const pwd = form.querySelector("#password").value
    const confirm_pwd = form.querySelector("#cpassword").value

    if(pwd !== confirm_pwd) {
        showAlert(document.querySelector("#alerts"),"warning","Passwords are not matching",true)
        mistakes = true;
    }
    if (username === "") {
        showAlert(document.querySelector("#alerts"),"warning","Username cannot be empty",true)
        mistakes = true;
    }
    
    return mistakes;
}

