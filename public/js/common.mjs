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


if (localStorage.getItem("dark_mode") == 'true') {
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
            localStorage.setItem("dark_mode", 'true');
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem("dark_mode", 'false');
        }
    });





// Edit user modal form

let changeUsernameForm = document.getElementById("changeusernameform");

changeUsernameForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const mistakes = validateUsernameForm(this);
    if(mistakes) {
        return
    } else {
        fetch(this.action, {
            method: this.method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify({
                username: changeUsernameForm.querySelector("input[name='username']").value
            })
        })
        .then(res => {return res.json()})
        .then(obj => {
            if(obj.error == 0) {
                showAlert(document.querySelector("#useralertsmodal"),"warning","Username is the same",true)
            } else if (obj.error == -1) {
                showAlert(document.querySelector("#useralertsmodal"),"warning","Username is taken",true)
            } else {
                location.reload();
            }
        })
    }
})

let changePasswordForm = document.getElementById("changepasswordform");

changePasswordForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const mistakes = validatePasswordForm(this);
    if(mistakes) {
        return
    } else {
        fetch(this.action, {
            method: this.method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify({
                password: changePasswordForm.querySelector("input[name='password']").value
            })
        })
        .then(res => {return res.json()})
        .then(obj => {
            location.reload();
        })
    }
})

let changePictureForm = document.getElementById("changepictureform");

changePictureForm.addEventListener("submit", function(e) {
    fetch(this.action, {
        method: this.method,
        headers: {
            "Content-Type": "application/json",
        }
    })
})

let changeEmailForm = document.getElementById("changeemailform");

changeEmailForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const mistakes = validateEmailForm(this);
    if(mistakes) {
        return
    } else {
        fetch(this.action, {
            method: this.method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify({
                email: changeEmailForm.querySelector("input[name='email']").value
            })
        })
        .then(res => {return res.json()})
        .then(obj => {
            location.reload();
        })
    }
})

function validateUsernameForm(form) {
    var mistakes = false;

    const username = form.querySelector("#username").value.trim();
    if (username === "") {
        showAlert(document.querySelector("#useralertsmodal"),"warning","Username cannot be empty",true)
        mistakes = true;
    }
    return mistakes;
}

function validatePasswordForm(form) {
    var mistakes = false;

    const pwd = form.querySelector("#password").value
    const confirm_pwd = form.querySelector("#cpassword").value
    if(pwd !== confirm_pwd) {
        showAlert(document.querySelector("#passwordalertsmodal"),"warning","Passwords are not matching",true)
        mistakes = true;
    }
    if (pwd === "" || confirm_pwd === "") {
        showAlert(document.querySelector("#passwordalertsmodal"),"warning","Password cannot be empty!", true);
        mistakes = true;
    }
    return mistakes;
}

function validateEmailForm(form) {
    var mistakes = false;

    const email = form.querySelector("#email").value
    const cemail = form.querySelector("#cemail").value
    const mailformat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(mailformat)) {
        showAlert(document.querySelector("#emailalertsmodal"),"warning","Please insert a valid email",true)
        mistakes = true;
    } else if (email !== cemail) {
        showAlert(document.querySelector("#emailalertsmodal"),"warning","Emails do not match",true)
        mistakes = true;
    }

    return mistakes;
}
