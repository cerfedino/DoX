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





let form = document.querySelector(".modal-body form")
  
// Submission of the User update form
// form.addEventListener("submit",function(e){
//     e.preventDefault()

//     // Check for invalid fields
//     // const mistakes = validateForm(this)
//     // if(mistakes) {
//     //     // showAlert(document.querySelector("#alerts"),"warning",mistakes,false)
//     //     return
//     // }
//     // //
    

//     // console.log(this.method, this.action)
//     console.log(document.querySelector(".modal-body form #username").value);
//     let body = new FormData(form);
//     console.log('body', body);
//     fetch('/user',{ method : "PUT", body})
// })
