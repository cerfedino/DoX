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
 */
function showAlert(container, alert_type="warning", text="", append=true) {
    const alert =
        `<div class="alert alert-${alert_type} alert-dismissible fade show" role="alert">
              ${text}
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>`

    if(append) {
        container.insertAdjacentHTML("afterbegin",alert)
    } else
        container.innerHTML = alert
}

// Dark-theme toggle
document.querySelector("#dark-mode-toggle")?.addEventListener('change',
    function() {
        if(this.checked)
            document.body.classList.add("dark-theme")
        else
            document.body.classList.remove('dark-theme')
    });