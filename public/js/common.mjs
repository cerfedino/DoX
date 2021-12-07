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

// Dark-theme toggle
document.querySelector("#dark-mode-toggle")?.addEventListener('change',
    function() {
        if(this.checked)
            document.body.classList.add("dark-theme")
        else
            document.body.classList.remove('dark-theme')
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


// Time Formatting Functions

// Takes a Date object and returns a date string considering:
// - If the document was created the same day it specifies the time:
// eg: Today at 12:17
// - If the document was created yesterday it specifies the time:
// eg: Yesterday at 12:17
// - If the document was created at most 7 days ago it specifies how many days ago:
//  eg: 5 days ago
// - If the document was created at most 1 month ago it specifies how many weeks ago
// eg: 2 weeks ago 
// - If the document was created more than one month ago it specifies the full date
// eg: On 07/12/2021

function formatTime(date) {

    const now = new Date();
    let nowmonth = checkLess(now.getUTCMonth() + 1); //months from 1-12
    let nowday = checkLess(now.getUTCDate());
    let nowyear = now.getUTCFullYear();
    let nowhour = checkLess(now.getHours());
    let nowminutes = checkLess(now.getMinutes());

    let month = checkLess(date.getUTCMonth() + 1); //months from 1-12
    let day = checkLess(date.getUTCDate());
    let year = date.getUTCFullYear();
    let hour = checkLess(date.getHours());
    let minutes = checkLess(date.getMinutes());
    

    if (day === nowday && year === nowyear) {
        return "Today at " + hour + ":" + minutes;
    }

    if (((nowday - day) === 1) && year === nowyear) {
        return "Yesterday at " + hour + ":" + minutes;
    }
    
    if ((((now.getTime() - date.getTime()) / 86400000) <= 7) && ((now.getTime() - date.getTime()) / 86400000) >= 2){
        return Math.floor(((now.getTime() - date.getTime()) / 86400000)) + " days ago"
    }

    if ((((now.getTime() - date.getTime()) / (86400000 * 7)) <= 4) && ((now.getTime() - date.getTime()) / (86400000 * 7) >= 1)){
        return Math.floor(((now.getTime() - date.getTime()) / (86400000 * 7))) + " weeks ago"
    }

    return "On " + day + "/" + month + "/" + year
    
}

function checkLess(n) {
    if (n < 10) {
        n = "0" + n 
    }
    return n;
}