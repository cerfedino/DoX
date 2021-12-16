//EJS Compiled Views - This file was automatically generated on Thu Dec 16 2021 21:58:10 GMT+0100 (Central European Standard Time)
ejs.views_include = function(locals) {
    console.log("views_include_setup",locals);
    return function(path, d) {
        console.log("ejs.views_include",path,d);
        return ejs["views_"+path.replace(/\//g,"_")]({...d,...locals}, null, ejs.views_include(locals));
    }
};
ejs.views_documents = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n\n<%\nif(!docs) {\n    var docs = []\n}\n\nvar messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageSuccess}\", true)</script>` : '';\nvar messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageFailure}\", true)</script>` : '';\n\n%>\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Documents</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/documents.css\");\n    </style>\n</head>\n<body>\n<script src=\"/js/ejs.min.js\"></script>\n<script src=\"/js/views.js\"  ></script>\n\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n    <%- include('includes/header', {'extra' : 'search'}) %>\n\n    <section class=\"tools-bar\">\n        <a class=\"new-doc\" href=\"/docs/new\"><i class=\"bi bi-file-earmark-plus-fill\"></i> New</a>\n\n        <!-- Card/Grid view buttons -->\n        <div class=\"switch-list-grid\">\n            <a class=\"grid-view\" href=\"\">\n                <svg class=\"svg-inline--fa fa-th fa-w-16\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fa\" data-icon=\"th\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" data-fa-i2svg=\"\"><path fill=\"currentColor\" d=\"M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z\"></path></svg>\n            </a>\n            <a class=\"list-view\" href=\"\"><i class=\"fa fa-list\"></i></a>\n        </div>\n\n        <!-- Sort section -->\n        <div class=\"dropdown show sort\">\n            <a class=\"btn btn-secondary dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\">\n                Sort by\n            </a>\n          \n            <div class=\"dropdown-menu\">\n                <a class=\"dropdown-item\" href=\"#\" rel=\"creation-date\">Create Date</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"edit-date\">Edit Date</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"title\">Title</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"owner\">Owner</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"shared\"># of shares</a>\n            </div>\n        </div>\n        <button class=\"active-sort\"></button>\n\n        <!-- Filter section -->\n        <div class=\"dropdown show filter\">\n            <a class=\"btn btn-secondary dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\">\n                Filter\n            </a>\n            <div class=\"dropdown-menu\">\n                <form id=\"filters\">\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-owned\">Owned by me</label>\n                        <input name=\"filter-owned\" type=\"checkbox\">\n                    </article>\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-read\">Reading Permissions</label>\n                        <input name=\"filter-read\" type=\"checkbox\">\n                    </article>\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-edit\">Writing Permissions</label>\n                        <input name=\"filter-edit\" type=\"checkbox\">\n                    </article>\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-shared\">Shared Documents</label>\n                        <input name=\"filter-shared\" type=\"checkbox\">\n                    </article>\n                    <input name=\"filter-submit\" type=\"submit\" value=\"Save\">\n                </form>\n            </div>\n        </div>\n        <section class=\"active-filters\">\n            \n        </section>\n    </section>\n\n    <main >\n        <% if(docs.length == 0) { %>\n            <div id=\"no-documents\">No documents</div>\n        <% } %>\n    \n        \n        <section class=\"cards\" id=\"table-of-documents\">\n                <article class=\"list-element head\">\n                    <span class=\"info\"></span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"title\">Title</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"owner\">Owner</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"shared\">Shared</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-numeric-down\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-numeric-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M11.36 7.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.836 1.973-1.836 1.09 0 2.063.637 2.063 2.688 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z\"/>\n                                <path d=\"M12.438 8.668V14H11.39V9.684h-.051l-1.211.859v-.969l1.262-.906h1.046zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"edit-date\">Last Edit</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"creation-date\">Creation Date</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\"><b><a href=\"#\">Delete</a></b></span>\n                </article>\n            \n            <% docs.forEach((doc)=>{%>\n                <%- include('includes/doc_card.ejs',{doc}) %>\n            <% }); %>\n        </section>\n\n        <!-- Modal for document deletion confirm -->\n        <div class=\"modal fade\" id=\"confirm-deletion-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"confirm-deletion-modalLabel\" aria-hidden=\"true\">\n            <div class=\"modal-dialog\" role=\"document\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header text-center\">\n                        <h5 class=\"modal-title\" id=\"confirm-deletion-modalLabel\"><span>Are you sure ?</span></h5>\n                    </div>\n                    <div class=\"modal-body\">\n                        <span class=\"col-form-label\">Are you sure you want to delete document '</span><span id='deletion-modal-doc-title'> </span><span>'?<br> <b>This action cannot be undone</b></span>\n                    </div>\n\n                    <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n                        <button data-delete_action=\"\" id=\"deletion-modal-confirm\" type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Delete document</button>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <!--##################-->\n    </main>\n\n<div id=\"alerts\">\n    \n\n</div>\n<!-- <form id=\"send_put\">\n   <input type=\"submit\" value=\"Submit\"> </form>\n</form> -->\n\n<script src=\"/js/common.mjs\"></script>\n<script onload=\"init_documents()\" src=\"/js/documents.js\"></script>\n\n<%- messagesuccess %>\n<%- messagefailure %>\n\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n\n<script>\n    $(document).ready(function(){\n        $('[data-toggle=\"popover\"]').popover({\n            html:true\n        });   \n    });\n    </script>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n\n")
    ; __line = 14
    ; 
if(!docs) {
    var docs = []
}

var messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageSuccess}", true)</script>` : '';
var messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageFailure}", true)</script>` : '';


    ; __line = 22
    ; __append("\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Documents</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/documents.css\");\n    </style>\n</head>\n<body>\n<script src=\"/js/ejs.min.js\"></script>\n<script src=\"/js/views.js\"  ></script>\n\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n    ")
    ; __line = 46
    ; __append( include('includes/header', {'extra' : 'search'}) )
    ; __append("\n\n    <section class=\"tools-bar\">\n        <a class=\"new-doc\" href=\"/docs/new\"><i class=\"bi bi-file-earmark-plus-fill\"></i> New</a>\n\n        <!-- Card/Grid view buttons -->\n        <div class=\"switch-list-grid\">\n            <a class=\"grid-view\" href=\"\">\n                <svg class=\"svg-inline--fa fa-th fa-w-16\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fa\" data-icon=\"th\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" data-fa-i2svg=\"\"><path fill=\"currentColor\" d=\"M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z\"></path></svg>\n            </a>\n            <a class=\"list-view\" href=\"\"><i class=\"fa fa-list\"></i></a>\n        </div>\n\n        <!-- Sort section -->\n        <div class=\"dropdown show sort\">\n            <a class=\"btn btn-secondary dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\">\n                Sort by\n            </a>\n          \n            <div class=\"dropdown-menu\">\n                <a class=\"dropdown-item\" href=\"#\" rel=\"creation-date\">Create Date</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"edit-date\">Edit Date</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"title\">Title</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"owner\">Owner</a>\n                <a class=\"dropdown-item\" href=\"#\" rel=\"shared\"># of shares</a>\n            </div>\n        </div>\n        <button class=\"active-sort\"></button>\n\n        <!-- Filter section -->\n        <div class=\"dropdown show filter\">\n            <a class=\"btn btn-secondary dropdown-toggle\" href=\"#\" data-toggle=\"dropdown\">\n                Filter\n            </a>\n            <div class=\"dropdown-menu\">\n                <form id=\"filters\">\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-owned\">Owned by me</label>\n                        <input name=\"filter-owned\" type=\"checkbox\">\n                    </article>\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-read\">Reading Permissions</label>\n                        <input name=\"filter-read\" type=\"checkbox\">\n                    </article>\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-edit\">Writing Permissions</label>\n                        <input name=\"filter-edit\" type=\"checkbox\">\n                    </article>\n                    <article class=\"dropdown-item filter\">\n                        <label for=\"filter-shared\">Shared Documents</label>\n                        <input name=\"filter-shared\" type=\"checkbox\">\n                    </article>\n                    <input name=\"filter-submit\" type=\"submit\" value=\"Save\">\n                </form>\n            </div>\n        </div>\n        <section class=\"active-filters\">\n            \n        </section>\n    </section>\n\n    <main >\n        ")
    ; __line = 108
    ;  if(docs.length == 0) { 
    ; __append("\n            <div id=\"no-documents\">No documents</div>\n        ")
    ; __line = 110
    ;  } 
    ; __append("\n    \n        \n        <section class=\"cards\" id=\"table-of-documents\">\n                <article class=\"list-element head\">\n                    <span class=\"info\"></span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"title\">Title</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"owner\">Owner</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"shared\">Shared</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-numeric-down\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.438 1.668V7H11.39V2.684h-.051l-1.211.859v-.969l1.262-.906h1.046z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M11.36 14.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.835 1.973-1.835 1.09 0 2.063.636 2.063 2.687 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-numeric-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M11.36 7.098c-1.137 0-1.708-.657-1.762-1.278h1.004c.058.223.343.45.773.45.824 0 1.164-.829 1.133-1.856h-.059c-.148.39-.57.742-1.261.742-.91 0-1.72-.613-1.72-1.758 0-1.148.848-1.836 1.973-1.836 1.09 0 2.063.637 2.063 2.688 0 1.867-.723 2.848-2.145 2.848zm.062-2.735c.504 0 .933-.336.933-.972 0-.633-.398-1.008-.94-1.008-.52 0-.927.375-.927 1 0 .64.418.98.934.98z\"/>\n                                <path d=\"M12.438 8.668V14H11.39V9.684h-.051l-1.211.859v-.969l1.262-.906h1.046zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"edit-date\">Last Edit</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\">\n                        <b><a href=\"#\" rel=\"creation-date\">Creation Date</a></b>\n                        <a class=\"reverse-sort\" href=\"#\">\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down\" viewBox=\"0 0 16 16\">\n                                <path fill-rule=\"evenodd\" d=\"M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z\"/>\n                                <path d=\"M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-sort-alpha-down-alt rev\" viewBox=\"0 0 16 16\">\n                                <path d=\"M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z\"/>\n                                <path fill-rule=\"evenodd\" d=\"M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z\"/>\n                                <path d=\"M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z\"/>\n                            </svg>\n                        </a>\n                    </span>\n                    <span class=\"info\"><b><a href=\"#\">Delete</a></b></span>\n                </article>\n            \n            ")
    ; __line = 189
    ;  docs.forEach((doc)=>{
    ; __append("\n                ")
    ; __line = 190
    ; __append( include('includes/doc_card.ejs',{doc}) )
    ; __append("\n            ")
    ; __line = 191
    ;  }); 
    ; __append("\n        </section>\n\n        <!-- Modal for document deletion confirm -->\n        <div class=\"modal fade\" id=\"confirm-deletion-modal\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"confirm-deletion-modalLabel\" aria-hidden=\"true\">\n            <div class=\"modal-dialog\" role=\"document\">\n                <div class=\"modal-content\">\n                    <div class=\"modal-header text-center\">\n                        <h5 class=\"modal-title\" id=\"confirm-deletion-modalLabel\"><span>Are you sure ?</span></h5>\n                    </div>\n                    <div class=\"modal-body\">\n                        <span class=\"col-form-label\">Are you sure you want to delete document '</span><span id='deletion-modal-doc-title'> </span><span>'?<br> <b>This action cannot be undone</b></span>\n                    </div>\n\n                    <div class=\"modal-footer\">\n                        <button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">Cancel</button>\n                        <button data-delete_action=\"\" id=\"deletion-modal-confirm\" type=\"button\" class=\"btn btn-danger\" data-dismiss=\"modal\">Delete document</button>\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <!--##################-->\n    </main>\n\n<div id=\"alerts\">\n    \n\n</div>\n<!-- <form id=\"send_put\">\n   <input type=\"submit\" value=\"Submit\"> </form>\n</form> -->\n\n<script src=\"/js/common.mjs\"></script>\n<script onload=\"init_documents()\" src=\"/js/documents.js\"></script>\n\n")
    ; __line = 227
    ; __append( messagesuccess )
    ; __append("\n")
    ; __line = 228
    ; __append( messagefailure )
    ; __append("\n\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n\n<script>\n    $(document).ready(function(){\n        $('[data-toggle=\"popover\"]').popover({\n            html:true\n        });   \n    });\n    </script>\n\n</body>\n</html>")
    ; __line = 244
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_edit = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n<%\nvar messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageSuccess}\", true)</script>` : '';\nvar messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageFailure}\", true)</script>` : '';\n%>\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX — Edit — <%= doc.title %></title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <link href=\"/css/common.css\" rel=\"stylesheet\">\n    <link href=\"/css/edit.css\" rel=\"stylesheet\">\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css\" rel=\"stylesheet\">\n</head>\n<body class=\"\">\n<%- include('includes/header', {'extra' : \"editor\"}) %>\n\n<div class=\"editor-tools\">\n    <div id=\"actions\" class=\"action-icons container d-flex flex-wrap justify-content-start align-items-center\">\n        \n        <div class=\"dropdown me-2\">\n            <button class=\"btn-sm btn-secondary dropdown-toggle\" type=\"button\" id=\"headingMenu\"\n                    data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Normal text\n            </button>\n\n            <ul class=\"dropdown-menu\" aria-labelledby=\"headingMenu\">\n                <li>\n                    <button id=\"action-h1\" class=\"dropdown-item h1\">Heading 1</button>\n                </li>\n                <li>\n                    <button id=\"action-h2\" class=\"dropdown-item h2\">Heading 2</button>\n                </li>\n                <li>\n                    <button id=\"action-h3\" class=\"dropdown-item h3\">Heading 3</button>\n                </li>\n                <li>\n                    <button id=\"action-h4\" class=\"dropdown-item h4\">Heading 4</button>\n                </li>\n                <li>\n                    <button id=\"action-h5\" class=\"dropdown-item h5\">Heading 5</button>\n                </li>\n                <li>\n                    <button id=\"action-h6\" class=\"dropdown-item h6\">Heading 6</button>\n                </li>\n                <li>\n                    <hr class=\"dropdown-divider\">\n                </li>\n                <li>\n                    <button id=\"action-p\" class=\"dropdown-item\">Normal text</button>\n                </li>\n            </ul>\n        </div>\n \n\n        <i id=\"action-bold\" class=\"action bi-type-bold\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Bold (Ctrl-B)\"></i>\n        <i id=\"action-italic\" class=\"action bi-type-italic\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Italic (Ctrl-I)\"></i>\n        <i id=\"action-underline\" class=\"action bi-type-underline\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Underline (Ctrl-U)\"></i>\n\n        <input class=\"me-1\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Text color\"\n               id=\"action-pick-color\"\n               type=\"color\" value=\"#000000\"\n               aria-label=\"Text color\">\n\n        <i id=\"action-lift-item\" class=\"action bi-text-indent-left\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Lift list item\"></i>\n        <i id=\"action-bullet-list\" class=\"action bi-list-ul\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Bulleted list (Ctrl-Shift-8)\"></i>\n        <i id=\"action-ordered-list\" class=\"action bi-list-ol\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Ordered list (Ctrl-Shift-7)\"></i>\n\n        <a data-bs-toggle=\"modal\" data-bs-target=\"#insertImageModal\">\n            <i class=\"action bi-image\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n               title=\"Insert image\"></i>\n        </a>\n\n        <a data-bs-toggle=\"modal\" data-bs-target=\"#insertLinkModal\">\n            <i class=\"action bi-link\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n               title=\"Insert link\"></i>\n        </a>\n\n        <i id=\"action-undo\" class=\"action bi-arrow-counterclockwise\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Undo (Ctrl-Z)\"></i>\n        <i id=\"action-redo\" class=\"action bi-arrow-clockwise\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Redo (Ctrl-Shift-Z)\"></i>\n\n\n\n\n        <div class=\"ms-auto d-flex flex-wrap\">\n            <div class=\"text-end d-flex flex-wrap ms-3\">\n                <div class=\"dropdown dropdown-menu-end me-2\">\n                    <button class=\"btn-sm btn-primary dropdown-toggle h-100\" type=\"button\" data-bs-toggle=\"dropdown\"\n                            aria-expanded=\"false\" id=\"active-users-button\">Active\n                    </button>\n                    <ul class=\"dropdown-menu\" aria-labelledby=\"active-users-button\" id=\"active-users\"\n                        style=\"width: 320px\">\n                    </ul>\n                </div>\n                <!-- <button type=\"button\" class=\"btn-sm btn-primary me-2\" data-bs-toggle=\"modal\" data-bs-target=\"#renameModal\">\n                    Rename\n                </button> -->\n                <button id=\"button-share\" type=\"button\" class=\"btn btn-warning px-3 me-2\">\n                    <i class=\"bi-share\"></i>\n                </button>\n                <button id=\"button-save\" type=\"button\" class=\"btn btn-success\">\n                    <i class=\"bi-save\"></i>\n                </button>\n                <p id=\"message-save\"\n                   class=\"mt-auto mb-auto me-3\"></p>\n            </div>\n\n        </div>\n    </div>\n</div>\n\n<main class=\"document-view\">\n    <div id=\"editor\" class=\"p-5\">\n    </div>\n</main>\n\n<!-- Insert image modal -->\n<div class=\"modal fade\" id=\"insertImageModal\" tabindex=\"-1\" aria-labelledby=\"insertImageLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <form class=\"modal-content\" method=\"post\" action=\"/\" id=\"insert-image-form\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\" id=\"insertImageLabel\">Insert image</h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"row mb-3\">\n                    <label for=\"image-src\" class=\"col-3 col-form-label\">Image source</label>\n                    <div class=\"col-9\">\n                        <input type=\"text\" class=\"form-control\" id=\"image-src\"\n                               placeholder=\"https://example.com/image.jpeg\" required>\n                        <div class=\"invalid-feedback\">\n                            Please provide the source of the image\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <label for=\"image-alt\" class=\"col-3 col-form-label\">Alternate text</label>\n                    <div class=\"col-9\">\n                        <input type=\"text\" class=\"form-control\" id=\"image-alt\"\n                               placeholder=\"Example image\">\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\n                <input type=\"submit\" class=\"btn btn-primary\" id=\"action-insert-image\" value=\"Insert\">\n            </div>\n        </form>\n    </div>\n</div>\n<!-- Rename modal -->\n<div class=\"modal fade\" id=\"renameModal\" tabindex=\"-1\" aria-labelledby=\"renameLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <form class=\"modal-content\" method=\"post\" action=\"/\" id=\"rename-form\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\" id=\"renameLabel\">Rename file</h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"row mb-3\">\n                    <label for=\"new-name\" class=\"col-3 col-form-label\">New name</label>\n                    <div class=\"col-9\">\n                        <input type=\"text\" class=\"form-control\" id=\"new-name\" value=\"<%= doc.title %>\" required>\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\n                <input type=\"submit\" class=\"btn btn-primary\" id=\"action-rename\" value=\"Rename\">\n            </div>\n        </form>\n    </div>\n</div>\n<!-- Insert link modal -->\n<div class=\"modal fade\" id=\"insertLinkModal\" tabindex=\"-1\" aria-labelledby=\"inserLinkLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <form class=\"modal-content\" method=\"post\" action=\"/\" id=\"insert-link-form\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\" id=\"renameLabel\">Insert link</h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"row mb-3\">\n                    <label for=\"link-href\" class=\"col-3 col-form-label\">URL</label>\n                    <div class=\"col-9\">\n                        <input type=\"url\" class=\"form-control\" id=\"link-href\"\n                               placeholder=\"https://example.com\" required>\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\n                <input type=\"submit\" class=\"btn btn-primary\" id=\"action-insert-link\" value=\"Insert\">\n            </div>\n        </form>\n    </div>\n</div>\n\n\n<script>\n    // Get document state and ID as a global varaiable\n    const documentID = '<%- doc._id %>'\n</script>\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js\"\n        integrity=\"sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p\"\n        crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js\"\n        integrity=\"sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==\"\n        crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>\n<script type=\"module\" src=\"/js/build-editor.js\"></script>\n<script>\n    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=\"tooltip\"]'))\n    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {\n        return new bootstrap.Tooltip(tooltipTriggerEl)\n    });\n</script>\n\n\n<script src=\"/js/common.mjs\"></script>\n\n<%- messagesuccess %>\n<%- messagefailure %>\n\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n")
    ; __line = 13
    ; 
var messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageSuccess}", true)</script>` : '';
var messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageFailure}", true)</script>` : '';

    ; __line = 16
    ; __append("\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX — Edit — ")
    ; __line = 22
    ; __append(escapeFn( doc.title ))
    ; __append("</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <link href=\"/css/common.css\" rel=\"stylesheet\">\n    <link href=\"/css/edit.css\" rel=\"stylesheet\">\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css\" rel=\"stylesheet\">\n</head>\n<body class=\"\">\n")
    ; __line = 30
    ; __append( include('includes/header', {'extra' : "editor"}) )
    ; __append("\n\n<div class=\"editor-tools\">\n    <div id=\"actions\" class=\"action-icons container d-flex flex-wrap justify-content-start align-items-center\">\n        \n        <div class=\"dropdown me-2\">\n            <button class=\"btn-sm btn-secondary dropdown-toggle\" type=\"button\" id=\"headingMenu\"\n                    data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Normal text\n            </button>\n\n            <ul class=\"dropdown-menu\" aria-labelledby=\"headingMenu\">\n                <li>\n                    <button id=\"action-h1\" class=\"dropdown-item h1\">Heading 1</button>\n                </li>\n                <li>\n                    <button id=\"action-h2\" class=\"dropdown-item h2\">Heading 2</button>\n                </li>\n                <li>\n                    <button id=\"action-h3\" class=\"dropdown-item h3\">Heading 3</button>\n                </li>\n                <li>\n                    <button id=\"action-h4\" class=\"dropdown-item h4\">Heading 4</button>\n                </li>\n                <li>\n                    <button id=\"action-h5\" class=\"dropdown-item h5\">Heading 5</button>\n                </li>\n                <li>\n                    <button id=\"action-h6\" class=\"dropdown-item h6\">Heading 6</button>\n                </li>\n                <li>\n                    <hr class=\"dropdown-divider\">\n                </li>\n                <li>\n                    <button id=\"action-p\" class=\"dropdown-item\">Normal text</button>\n                </li>\n            </ul>\n        </div>\n \n\n        <i id=\"action-bold\" class=\"action bi-type-bold\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Bold (Ctrl-B)\"></i>\n        <i id=\"action-italic\" class=\"action bi-type-italic\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Italic (Ctrl-I)\"></i>\n        <i id=\"action-underline\" class=\"action bi-type-underline\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Underline (Ctrl-U)\"></i>\n\n        <input class=\"me-1\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\" title=\"Text color\"\n               id=\"action-pick-color\"\n               type=\"color\" value=\"#000000\"\n               aria-label=\"Text color\">\n\n        <i id=\"action-lift-item\" class=\"action bi-text-indent-left\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Lift list item\"></i>\n        <i id=\"action-bullet-list\" class=\"action bi-list-ul\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Bulleted list (Ctrl-Shift-8)\"></i>\n        <i id=\"action-ordered-list\" class=\"action bi-list-ol\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Ordered list (Ctrl-Shift-7)\"></i>\n\n        <a data-bs-toggle=\"modal\" data-bs-target=\"#insertImageModal\">\n            <i class=\"action bi-image\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n               title=\"Insert image\"></i>\n        </a>\n\n        <a data-bs-toggle=\"modal\" data-bs-target=\"#insertLinkModal\">\n            <i class=\"action bi-link\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n               title=\"Insert link\"></i>\n        </a>\n\n        <i id=\"action-undo\" class=\"action bi-arrow-counterclockwise\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Undo (Ctrl-Z)\"></i>\n        <i id=\"action-redo\" class=\"action bi-arrow-clockwise\" data-bs-toggle=\"tooltip\" data-bs-placement=\"top\"\n           title=\"Redo (Ctrl-Shift-Z)\"></i>\n\n\n\n\n        <div class=\"ms-auto d-flex flex-wrap\">\n            <div class=\"text-end d-flex flex-wrap ms-3\">\n                <div class=\"dropdown dropdown-menu-end me-2\">\n                    <button class=\"btn-sm btn-primary dropdown-toggle h-100\" type=\"button\" data-bs-toggle=\"dropdown\"\n                            aria-expanded=\"false\" id=\"active-users-button\">Active\n                    </button>\n                    <ul class=\"dropdown-menu\" aria-labelledby=\"active-users-button\" id=\"active-users\"\n                        style=\"width: 320px\">\n                    </ul>\n                </div>\n                <!-- <button type=\"button\" class=\"btn-sm btn-primary me-2\" data-bs-toggle=\"modal\" data-bs-target=\"#renameModal\">\n                    Rename\n                </button> -->\n                <button id=\"button-share\" type=\"button\" class=\"btn btn-warning px-3 me-2\">\n                    <i class=\"bi-share\"></i>\n                </button>\n                <button id=\"button-save\" type=\"button\" class=\"btn btn-success\">\n                    <i class=\"bi-save\"></i>\n                </button>\n                <p id=\"message-save\"\n                   class=\"mt-auto mb-auto me-3\"></p>\n            </div>\n\n        </div>\n    </div>\n</div>\n\n<main class=\"document-view\">\n    <div id=\"editor\" class=\"p-5\">\n    </div>\n</main>\n\n<!-- Insert image modal -->\n<div class=\"modal fade\" id=\"insertImageModal\" tabindex=\"-1\" aria-labelledby=\"insertImageLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <form class=\"modal-content\" method=\"post\" action=\"/\" id=\"insert-image-form\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\" id=\"insertImageLabel\">Insert image</h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"row mb-3\">\n                    <label for=\"image-src\" class=\"col-3 col-form-label\">Image source</label>\n                    <div class=\"col-9\">\n                        <input type=\"text\" class=\"form-control\" id=\"image-src\"\n                               placeholder=\"https://example.com/image.jpeg\" required>\n                        <div class=\"invalid-feedback\">\n                            Please provide the source of the image\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <label for=\"image-alt\" class=\"col-3 col-form-label\">Alternate text</label>\n                    <div class=\"col-9\">\n                        <input type=\"text\" class=\"form-control\" id=\"image-alt\"\n                               placeholder=\"Example image\">\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\n                <input type=\"submit\" class=\"btn btn-primary\" id=\"action-insert-image\" value=\"Insert\">\n            </div>\n        </form>\n    </div>\n</div>\n<!-- Rename modal -->\n<div class=\"modal fade\" id=\"renameModal\" tabindex=\"-1\" aria-labelledby=\"renameLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <form class=\"modal-content\" method=\"post\" action=\"/\" id=\"rename-form\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\" id=\"renameLabel\">Rename file</h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"row mb-3\">\n                    <label for=\"new-name\" class=\"col-3 col-form-label\">New name</label>\n                    <div class=\"col-9\">\n                        <input type=\"text\" class=\"form-control\" id=\"new-name\" value=\"")
    ; __line = 184
    ; __append(escapeFn( doc.title ))
    ; __append("\" required>\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\n                <input type=\"submit\" class=\"btn btn-primary\" id=\"action-rename\" value=\"Rename\">\n            </div>\n        </form>\n    </div>\n</div>\n<!-- Insert link modal -->\n<div class=\"modal fade\" id=\"insertLinkModal\" tabindex=\"-1\" aria-labelledby=\"inserLinkLabel\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-dialog-centered\">\n        <form class=\"modal-content\" method=\"post\" action=\"/\" id=\"insert-link-form\">\n            <div class=\"modal-header\">\n                <h5 class=\"modal-title\" id=\"renameLabel\">Insert link</h5>\n                <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"Close\"></button>\n            </div>\n            <div class=\"modal-body\">\n                <div class=\"row mb-3\">\n                    <label for=\"link-href\" class=\"col-3 col-form-label\">URL</label>\n                    <div class=\"col-9\">\n                        <input type=\"url\" class=\"form-control\" id=\"link-href\"\n                               placeholder=\"https://example.com\" required>\n                    </div>\n                </div>\n            </div>\n            <div class=\"modal-footer\">\n                <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\">Close</button>\n                <input type=\"submit\" class=\"btn btn-primary\" id=\"action-insert-link\" value=\"Insert\">\n            </div>\n        </form>\n    </div>\n</div>\n\n\n<script>\n    // Get document state and ID as a global varaiable\n    const documentID = '")
    ; __line = 223
    ; __append( doc._id )
    ; __append("'\n</script>\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js\"\n        integrity=\"sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p\"\n        crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js\"\n        integrity=\"sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==\"\n        crossorigin=\"anonymous\" referrerpolicy=\"no-referrer\"></script>\n<script type=\"module\" src=\"/js/build-editor.js\"></script>\n<script>\n    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle=\"tooltip\"]'))\n    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {\n        return new bootstrap.Tooltip(tooltipTriggerEl)\n    });\n</script>\n\n\n<script src=\"/js/common.mjs\"></script>\n\n")
    ; __line = 242
    ; __append( messagesuccess )
    ; __append("\n")
    ; __line = 243
    ; __append( messagefailure )
    ; __append("\n\n</body>\n</html>")
    ; __line = 246
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_error = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n<% \nvar messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageSuccess}\", true)</script>` : '';\nvar messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageFailure}\", true)</script>` : '';\n%> \n\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Login</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/login_register.css\");\n    </style>\n</head>\n<body class=\"text-center\">\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n\n<main class=\"login-form\">\n    <svg id=\"logo\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 595.06 133.62\"><defs><style>.cls-1{font-size:175px;font-family:jumper_XBdIt, Jumper;font-weight:700;font-style:italic;}.cls-2{letter-spacing:-0.01em;}</style></defs><text class=\"cls-1\" transform=\"translate(0 126.81)\"><tspan class=\"cls-2\"></tspan><tspan x=\"102.9\" y=\"0\">DoX</tspan></text></svg>\n    <p>ERROR <b><%= s %></b></p> \n    <p><%= m %></p>\n    <a href=\"/docs\"> Go back</a>\n    \n</main>\n\n<div id=\"alerts\"></div>\n\n<input id=\"dark-mode-toggle\" type=\"checkbox\">\n\n<%- messagesuccess %>\n<%- messagefailure %>\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n</body>\n</html>\n\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n")
    ; __line = 12
    ;  
var messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageSuccess}", true)</script>` : '';
var messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageFailure}", true)</script>` : '';

    ; __line = 15
    ; __append(" \n\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Login</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/login_register.css\");\n    </style>\n</head>\n<body class=\"text-center\">\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n\n<main class=\"login-form\">\n    <svg id=\"logo\" data-name=\"Layer 1\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 595.06 133.62\"><defs><style>.cls-1{font-size:175px;font-family:jumper_XBdIt, Jumper;font-weight:700;font-style:italic;}.cls-2{letter-spacing:-0.01em;}</style></defs><text class=\"cls-1\" transform=\"translate(0 126.81)\"><tspan class=\"cls-2\"></tspan><tspan x=\"102.9\" y=\"0\">DoX</tspan></text></svg>\n    <p>ERROR <b>")
    ; __line = 39
    ; __append(escapeFn( s ))
    ; __append("</b></p> \n    <p>")
    ; __line = 40
    ; __append(escapeFn( m ))
    ; __append("</p>\n    <a href=\"/docs\"> Go back</a>\n    \n</main>\n\n<div id=\"alerts\"></div>\n\n<input id=\"dark-mode-toggle\" type=\"checkbox\">\n\n")
    ; __line = 49
    ; __append( messagesuccess )
    ; __append("\n")
    ; __line = 50
    ; __append( messagefailure )
    ; __append("\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n</body>\n</html>\n\n")
    ; __line = 58
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_includes_doc_card = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<%\n    if(!doc) {\n        throw \"doc is not defined !\"\n    }\n    if(typeof doc.created_date == \"string\") {\n        doc.created_date = new Date(doc.created_date)\n    }\n    if(typeof doc.edit_date == \"string\") {\n        doc.edit_date = new Date(doc.edit_date)\n    }\n%>\n<article id=\"<%= doc._id %>\" class=\"card-element\">\n    <a id=\"icon\" href=\"docs/<%= doc._id %>\">\n        <img src=\"/media/svg/notebook_icon.svg\" alt=\"Card image cap\">\n    </a>\n    <span class=\"title\"><%= doc.title %></span>\n    <p class=\"actual-creation-date\"><%= doc.created_date %></p>\n    <span class=\"info creation-date\"><%= doc.created_date %></span>\n    <p class=\"actual-edit-date\"><%= doc.edit_date %></p>\n    <span class=\"info edit-date\"><%= doc.edit_date %></span>\n    <span class=\"info\"></span>\n\n    <p class=\"owner\"><%= doc.owner %></p>\n    <span class=\"info owner\"></span>\n    <a class=\"delete\" data-delete_action=\"docs/<%= doc._id %>\" type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#confirm-deletion-modal\" >\n        <img src=\"/media/svg/delete.svg\" class=\"svgimgform\"></img>\n    </a>\n\n    <% let doc_perms = []\n    doc_perms.push(`\n                            <a class=\"dropdown-item user\" href=\"#\">\n                                <span class=\"user\">${doc.owner}</span>\n                                <span class=\"role\">owner</span>\n                            </a>`)\n    doc.perm_edit.forEach(u=>{\n        if (String(doc.owner) != String(u)) {\n            doc_perms.push(`\n                                    <a class=\"dropdown-item user\" href=\"#\">\n                                        <span class=\"user\">${u}</span>\n                                        <span class=\"role\">edit</span>\n                                    </a>`)\n        }\n    })\n    doc.perm_read.forEach(u=>{\n        if (String(doc.owner) != String(u)) {\n            let contained = false;\n            doc_perms.forEach(p=>{\n                if (p.includes(String(u))) {\n                    contained = true;\n                }\n            });\n            if (!contained) {\n                doc_perms.push(`\n                    <a class=\"dropdown-item user\" href=\"#\">\n                        <span class=\"user\">${u}</span>\n                        <span class=\"role\">read</span>\n                    </a>`);\n            }\n        }\n    }) %>\n    <p class=\"shared\"><%= doc_perms.length - 1 %></p>\n    <a class=\"perms\" id=\"end\" href=\"#\" data-html=\"true\" data-placement=\"top\" data-toggle=\"popover\" data-trigger=\"hover\" data-title='<div class=\"popovertitle\">Shared with</div>'\n       data-content='\n\n                        <% doc_perms.forEach(u=>{ %>\n                            <%- u %>\n                        <% })\n       if (doc_perms.length == 1) { %>\n                            <a class=\"dropdown-item doc\">Document not shared</a>\n                        <% } %>\n\n                        '><%= doc_perms.length -1 %> <img id=\"shared\" src=\"/media/svg/share.svg\" alt=\"Options\">\n    </a>\n\n    <a class=\"options\" id=\"start\" href=\"#\" data-html=\"true\" data-placement=\"top\" data-toggle=\"popover\" data-trigger=\"hover\" data-title='<div class=\"popovertitle\">Document Information</div>'\n       data-content=\"<span>Created on: <%= doc.created_date.toDateString() %></span><br>\n                        <span>Owner: <%= doc.owner %></span><br>\n                        <span>Size: <%= doc.size %></span>\n                        \"><img id=\"threedots\" src=\"/media/svg/options.svg\" alt=\"Options\"></a>\n\n</article>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; 
    if(!doc) {
        throw "doc is not defined !"
    }
    if(typeof doc.created_date == "string") {
        doc.created_date = new Date(doc.created_date)
    }
    if(typeof doc.edit_date == "string") {
        doc.edit_date = new Date(doc.edit_date)
    }

    ; __line = 11
    ; __append("\n<article id=\"")
    ; __line = 12
    ; __append(escapeFn( doc._id ))
    ; __append("\" class=\"card-element\">\n    <a id=\"icon\" href=\"docs/")
    ; __line = 13
    ; __append(escapeFn( doc._id ))
    ; __append("\">\n        <img src=\"/media/svg/notebook_icon.svg\" alt=\"Card image cap\">\n    </a>\n    <span class=\"title\">")
    ; __line = 16
    ; __append(escapeFn( doc.title ))
    ; __append("</span>\n    <p class=\"actual-creation-date\">")
    ; __line = 17
    ; __append(escapeFn( doc.created_date ))
    ; __append("</p>\n    <span class=\"info creation-date\">")
    ; __line = 18
    ; __append(escapeFn( doc.created_date ))
    ; __append("</span>\n    <p class=\"actual-edit-date\">")
    ; __line = 19
    ; __append(escapeFn( doc.edit_date ))
    ; __append("</p>\n    <span class=\"info edit-date\">")
    ; __line = 20
    ; __append(escapeFn( doc.edit_date ))
    ; __append("</span>\n    <span class=\"info\"></span>\n\n    <p class=\"owner\">")
    ; __line = 23
    ; __append(escapeFn( doc.owner ))
    ; __append("</p>\n    <span class=\"info owner\"></span>\n    <a class=\"delete\" data-delete_action=\"docs/")
    ; __line = 25
    ; __append(escapeFn( doc._id ))
    ; __append("\" type=\"button\" class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#confirm-deletion-modal\" >\n        <img src=\"/media/svg/delete.svg\" class=\"svgimgform\"></img>\n    </a>\n\n    ")
    ; __line = 29
    ;  let doc_perms = []
    doc_perms.push(`
                            <a class="dropdown-item user" href="#">
                                <span class="user">${doc.owner}</span>
                                <span class="role">owner</span>
                            </a>`)
    doc.perm_edit.forEach(u=>{
        if (String(doc.owner) != String(u)) {
            doc_perms.push(`
                                    <a class="dropdown-item user" href="#">
                                        <span class="user">${u}</span>
                                        <span class="role">edit</span>
                                    </a>`)
        }
    })
    doc.perm_read.forEach(u=>{
        if (String(doc.owner) != String(u)) {
            let contained = false;
            doc_perms.forEach(p=>{
                if (p.includes(String(u))) {
                    contained = true;
                }
            });
            if (!contained) {
                doc_perms.push(`
                    <a class="dropdown-item user" href="#">
                        <span class="user">${u}</span>
                        <span class="role">read</span>
                    </a>`);
            }
        }
    }) 
    ; __line = 60
    ; __append("\n    <p class=\"shared\">")
    ; __line = 61
    ; __append(escapeFn( doc_perms.length - 1 ))
    ; __append("</p>\n    <a class=\"perms\" id=\"end\" href=\"#\" data-html=\"true\" data-placement=\"top\" data-toggle=\"popover\" data-trigger=\"hover\" data-title='<div class=\"popovertitle\">Shared with</div>'\n       data-content='\n\n                        ")
    ; __line = 65
    ;  doc_perms.forEach(u=>{ 
    ; __append("\n                            ")
    ; __line = 66
    ; __append( u )
    ; __append("\n                        ")
    ; __line = 67
    ;  })
       if (doc_perms.length == 1) { 
    ; __line = 68
    ; __append("\n                            <a class=\"dropdown-item doc\">Document not shared</a>\n                        ")
    ; __line = 70
    ;  } 
    ; __append("\n\n                        '>")
    ; __line = 72
    ; __append(escapeFn( doc_perms.length -1 ))
    ; __append(" <img id=\"shared\" src=\"/media/svg/share.svg\" alt=\"Options\">\n    </a>\n\n    <a class=\"options\" id=\"start\" href=\"#\" data-html=\"true\" data-placement=\"top\" data-toggle=\"popover\" data-trigger=\"hover\" data-title='<div class=\"popovertitle\">Document Information</div>'\n       data-content=\"<span>Created on: ")
    ; __line = 76
    ; __append(escapeFn( doc.created_date.toDateString() ))
    ; __append("</span><br>\n                        <span>Owner: ")
    ; __line = 77
    ; __append(escapeFn( doc.owner ))
    ; __append("</span><br>\n                        <span>Size: ")
    ; __line = 78
    ; __append(escapeFn( doc.size ))
    ; __append("</span>\n                        \"><img id=\"threedots\" src=\"/media/svg/options.svg\" alt=\"Options\"></a>\n\n</article>")
    ; __line = 81
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_includes_header = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<header>\n\n    <div id=\"logo\" onclick=\"window.location='/docs';\"></div>\n\n\n    <% if(extra) { %>\n        <div id=\"extra\">\n\n            <% if (extra === \"search\") { %>\n                <input id=\"search\" type=\"text\" placeholder=\"Search...\">\n\n\n            <% } else if ( extra === \"editor\") { %>\n\n                <h1 id=\"doc-title\" data-bs-toggle=\"modal\" data-bs-target=\"#renameModal\"><%= doc.title %></h1>\n\n                <!-- <div style=\"display: flex;\">\n                    <button>Share</button>\n\n                    <div class=\"text-end d-flex flex-wrap ms-3\">\n                        <p id=\"message-save\" class=\"mt-auto mb-auto me-3\"></p>\n                        <button id=\"button-save\" type=\"button\" class=\"btn btn-success me-1\"><i class=\"bi-save me-1\"></i>\n                            Save\n                        </button>\n                    </div>\n                </div> -->\n\n                <button type=\"button-share\" class=\"btn btn-warning px-3\"><i class=\"bi bi-people\"></i></button>\n\n            <% } %>\n        </div>\n    <% } %>\n\n\n    <div id=\"profile_pic\">\n        <% if (isUserAuthenticated) { %>\n            <!-- <img id=\"profile_pic\" src='<%= user.profile_pic %>' onerror=\"if (this.src != './media/profile_pics/img_avatar.png') this.src = '../media/profile_pics/img_avatar.png';\"alt=\"<%= user.username %>\"> -->\n            <img id=\"profile_pic\" src='./media/profile_pics/<%= user._id %>.png' onerror=\"if (this.src != './media/profile_pics/img_avatar.png') this.src = '../media/profile_pics/img_avatar.png';\"alt=\"<%= user.username %>\">\n\n            <!-- <img id=\"profile_pic\" src=\"<%= user.profile_pic %>\" alt=\"<%= user.username %>\"> -->\n        <% } %>\n    </div>\n    \n    \n    <div class=\"modal-user\">\n        <div class=\"modal-content\">\n            \n            <div class=\"modal-header\">\n                <img id=\"profile_pic\" src='./media/profile_pics/img_avatar.png' onerror=\"if (this.src != './media/profile_pics/img_avatar.png') this.src = '../media/profile_pics/img_avatar.png';\"alt=\"<%= user.username %>\">\n                <!-- <img id=\"profile_pic\" src=\"<%= user.profile_pic %>\" alt=\"<%= user.username %>\"> -->\n            </div>\n            <div class=\"modal-body\">\n                <div id=\"info\">\n                    <h2><%= user.username %></h2>\n                    <p><%= user.email %></p>\n\n                </div>\n                <form style=\"display:none\" method=\"post\" action=\"/user?_method=PUT\" encType=\"multipart/form-data\">\n                    <div>\n                        <p style=\"margin:0; text-align:left; color: rgb(117,117,117);\"> New username:</p>\n                        <input type=\"text\" id=\"username\" name='username' value=\"<%= user.username %>\">\n                    </div>\n                    <div>\n                        <input style=\"border: 1px solid #c9c9c9; border-radius:3px;\" type=\"password\" id=\"password\" name=\"password\" placeholder=\"New password\">\n                    </div>\n                    <div>\n                        <input style=\"border: 1px solid #c9c9c9; border-radius:3px;\" type=\"password\" id=\"cpassword\" name=\"cpassword\" placeholder=\"Confirm password\">\n                    </div>\n                    \n                    <div class=\"form-floating\">\n                        <input type=\"file\" id=\"img\" name=\"file\">\n                    </div>\n        \n                    <div>\n                        <input type=\"submit\" id=\"profilemodal\" class=\"btn btn-sm btn-warning\">\n                    </div>\n                </form>\n                \n                \n            </div>\n            <div class=\"modal-footer\">\n                <div class=\"dark-mode\">\n                    <input id=\"dark-mode-toggle\" type=\"checkbox\" name=\"dark-mode\">\n                    <label for=\"dark-mode\">Dark mode</label>\n                </div>\n                <div id=\"button\">\n                    <button class=\"btn btn-sm btn-warning\" onclick=\"show_edit_user_form()\">Edit</button>\n                </div>\n\n                <form action=\"/auth/logout?_method=DELETE\" method=\"post\" class=\"logout\">\n                    <input type=\"submit\" class=\"btn btn-sm btn-danger\" value=\"Log out\"></input> \n                </form>\n                \n            </div>\n        </div>\n    </div>\n    \n</header>\n\n<script src=\"/js/common.mjs\"></script>\n\n<script>\n    // Get the modal\n    var modal = document.querySelector(\".modal-user\");\n    \n    // Get the button that opens the modal\n    var btn = document.getElementById(\"profile_pic\");\n    \n    // When the user clicks the button, open the modal \n    btn.onclick = function() {\n      modal.style.display = \"block\";\n    }\n    \n    // When the user clicks anywhere outside of the modal, close it\n    window.onclick = function(event) {\n      if (event.target == modal) {\n        modal.style.display = \"none\";\n      }\n    }\n\n    function show_user_info() {\n        document.querySelector('.modal-body #info').style = \"display:block\";\n        document.querySelector('.modal-body form').style = \"display:none\";\n        document.querySelector('.modal-footer #button').innerHTML = `<button onclick=\"show_edit_user_form()\" class=\"btn btn-sm btn-warning\">Edit</button>`;\n\n    }\n\n    function show_edit_user_form() {\n        document.querySelector('.modal-body #info').style = \"display:none\";\n        document.querySelector('.modal-body form').style = \"display:block\";\n        document.querySelector('.modal-footer #button').innerHTML = `<button onclick=\"show_user_info()\" class=\"btn btn-sm btn-warning\">Cancel</button>`;\n    }\n\n</script>\n\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<header>\n\n    <div id=\"logo\" onclick=\"window.location='/docs';\"></div>\n\n\n    ")
    ; __line = 6
    ;  if(extra) { 
    ; __append("\n        <div id=\"extra\">\n\n            ")
    ; __line = 9
    ;  if (extra === "search") { 
    ; __append("\n                <input id=\"search\" type=\"text\" placeholder=\"Search...\">\n\n\n            ")
    ; __line = 13
    ;  } else if ( extra === "editor") { 
    ; __append("\n\n                <h1 id=\"doc-title\" data-bs-toggle=\"modal\" data-bs-target=\"#renameModal\">")
    ; __line = 15
    ; __append(escapeFn( doc.title ))
    ; __append("</h1>\n\n                <!-- <div style=\"display: flex;\">\n                    <button>Share</button>\n\n                    <div class=\"text-end d-flex flex-wrap ms-3\">\n                        <p id=\"message-save\" class=\"mt-auto mb-auto me-3\"></p>\n                        <button id=\"button-save\" type=\"button\" class=\"btn btn-success me-1\"><i class=\"bi-save me-1\"></i>\n                            Save\n                        </button>\n                    </div>\n                </div> -->\n\n                <button type=\"button-share\" class=\"btn btn-warning px-3\"><i class=\"bi bi-people\"></i></button>\n\n            ")
    ; __line = 30
    ;  } 
    ; __append("\n        </div>\n    ")
    ; __line = 32
    ;  } 
    ; __append("\n\n\n    <div id=\"profile_pic\">\n        ")
    ; __line = 36
    ;  if (isUserAuthenticated) { 
    ; __append("\n            <!-- <img id=\"profile_pic\" src='")
    ; __line = 37
    ; __append(escapeFn( user.profile_pic ))
    ; __append("' onerror=\"if (this.src != './media/profile_pics/img_avatar.png') this.src = '../media/profile_pics/img_avatar.png';\"alt=\"")
    ; __append(escapeFn( user.username ))
    ; __append("\"> -->\n            <img id=\"profile_pic\" src='./media/profile_pics/")
    ; __line = 38
    ; __append(escapeFn( user._id ))
    ; __append(".png' onerror=\"if (this.src != './media/profile_pics/img_avatar.png') this.src = '../media/profile_pics/img_avatar.png';\"alt=\"")
    ; __append(escapeFn( user.username ))
    ; __append("\">\n\n            <!-- <img id=\"profile_pic\" src=\"")
    ; __line = 40
    ; __append(escapeFn( user.profile_pic ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( user.username ))
    ; __append("\"> -->\n        ")
    ; __line = 41
    ;  } 
    ; __append("\n    </div>\n    \n    \n    <div class=\"modal-user\">\n        <div class=\"modal-content\">\n            \n            <div class=\"modal-header\">\n                <img id=\"profile_pic\" src='./media/profile_pics/img_avatar.png' onerror=\"if (this.src != './media/profile_pics/img_avatar.png') this.src = '../media/profile_pics/img_avatar.png';\"alt=\"")
    ; __line = 49
    ; __append(escapeFn( user.username ))
    ; __append("\">\n                <!-- <img id=\"profile_pic\" src=\"")
    ; __line = 50
    ; __append(escapeFn( user.profile_pic ))
    ; __append("\" alt=\"")
    ; __append(escapeFn( user.username ))
    ; __append("\"> -->\n            </div>\n            <div class=\"modal-body\">\n                <div id=\"info\">\n                    <h2>")
    ; __line = 54
    ; __append(escapeFn( user.username ))
    ; __append("</h2>\n                    <p>")
    ; __line = 55
    ; __append(escapeFn( user.email ))
    ; __append("</p>\n\n                </div>\n                <form style=\"display:none\" method=\"post\" action=\"/user?_method=PUT\" encType=\"multipart/form-data\">\n                    <div>\n                        <p style=\"margin:0; text-align:left; color: rgb(117,117,117);\"> New username:</p>\n                        <input type=\"text\" id=\"username\" name='username' value=\"")
    ; __line = 61
    ; __append(escapeFn( user.username ))
    ; __append("\">\n                    </div>\n                    <div>\n                        <input style=\"border: 1px solid #c9c9c9; border-radius:3px;\" type=\"password\" id=\"password\" name=\"password\" placeholder=\"New password\">\n                    </div>\n                    <div>\n                        <input style=\"border: 1px solid #c9c9c9; border-radius:3px;\" type=\"password\" id=\"cpassword\" name=\"cpassword\" placeholder=\"Confirm password\">\n                    </div>\n                    \n                    <div class=\"form-floating\">\n                        <input type=\"file\" id=\"img\" name=\"file\">\n                    </div>\n        \n                    <div>\n                        <input type=\"submit\" id=\"profilemodal\" class=\"btn btn-sm btn-warning\">\n                    </div>\n                </form>\n                \n                \n            </div>\n            <div class=\"modal-footer\">\n                <div class=\"dark-mode\">\n                    <input id=\"dark-mode-toggle\" type=\"checkbox\" name=\"dark-mode\">\n                    <label for=\"dark-mode\">Dark mode</label>\n                </div>\n                <div id=\"button\">\n                    <button class=\"btn btn-sm btn-warning\" onclick=\"show_edit_user_form()\">Edit</button>\n                </div>\n\n                <form action=\"/auth/logout?_method=DELETE\" method=\"post\" class=\"logout\">\n                    <input type=\"submit\" class=\"btn btn-sm btn-danger\" value=\"Log out\"></input> \n                </form>\n                \n            </div>\n        </div>\n    </div>\n    \n</header>\n\n<script src=\"/js/common.mjs\"></script>\n\n<script>\n    // Get the modal\n    var modal = document.querySelector(\".modal-user\");\n    \n    // Get the button that opens the modal\n    var btn = document.getElementById(\"profile_pic\");\n    \n    // When the user clicks the button, open the modal \n    btn.onclick = function() {\n      modal.style.display = \"block\";\n    }\n    \n    // When the user clicks anywhere outside of the modal, close it\n    window.onclick = function(event) {\n      if (event.target == modal) {\n        modal.style.display = \"none\";\n      }\n    }\n\n    function show_user_info() {\n        document.querySelector('.modal-body #info').style = \"display:block\";\n        document.querySelector('.modal-body form').style = \"display:none\";\n        document.querySelector('.modal-footer #button').innerHTML = `<button onclick=\"show_edit_user_form()\" class=\"btn btn-sm btn-warning\">Edit</button>`;\n\n    }\n\n    function show_edit_user_form() {\n        document.querySelector('.modal-body #info').style = \"display:none\";\n        document.querySelector('.modal-body form').style = \"display:block\";\n        document.querySelector('.modal-footer #button').innerHTML = `<button onclick=\"show_user_info()\" class=\"btn btn-sm btn-warning\">Cancel</button>`;\n    }\n\n</script>\n\n")
    ; __line = 136
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_login = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n<% \nvar messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageSuccess}\", true)</script>` : '';\nvar messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageFailure}\", true)</script>` : '';\n%> \n\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Login</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/login_register.css\");\n    </style>\n</head>\n<body class=\"text-center\">\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n\n<main class=\"login-form\">\n    <form method=\"POST\" action=\"/auth/login\">\n        <div id=\"logo\"></div>\n\n        <h1 class=\"h3 mb-3 fw-normal\">Welcome to DoX!</h1>\n\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"text\" id=\"username\" name=\"username\" placeholder=\"Username\">\n            <label for=\"username\">Username</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"password\" id=\"password\" name=\"password\" placeholder=\"Password\">\n            <label for=\"password\">Password</label>\n        <input type=\"submit\" class=\"btn btn-primary w-100 btn-lg\" value=\"Sign in\">\n        <p>Not registered? <a href=\"/register\">Sign up</a></p>\n        <div class=\"form-alerts bottom\">\n            \n        </div>\n    </form>\n    \n</main>\n\n<div id=\"alerts\"></div>\n\n<div class=\"dark-mode\">\n    <input id=\"dark-mode-toggle\" type=\"checkbox\" name=\"dark-mode\">\n    <label for=\"dark-mode\">Dark mode</label>\n</div>\n\n<script src=\"/js/common.mjs\"></script>\n<script src=\"/js/login.js\" onload=\"init_login()\" ></script>\n\n<%- messagesuccess %>\n<%- messagefailure %>\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n</body>\n</html>\n\n"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n")
    ; __line = 13
    ;  
var messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageSuccess}", true)</script>` : '';
var messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageFailure}", true)</script>` : '';

    ; __line = 16
    ; __append(" \n\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Login</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/login_register.css\");\n    </style>\n</head>\n<body class=\"text-center\">\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n\n<main class=\"login-form\">\n    <form method=\"POST\" action=\"/auth/login\">\n        <div id=\"logo\"></div>\n\n        <h1 class=\"h3 mb-3 fw-normal\">Welcome to DoX!</h1>\n\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"text\" id=\"username\" name=\"username\" placeholder=\"Username\">\n            <label for=\"username\">Username</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"password\" id=\"password\" name=\"password\" placeholder=\"Password\">\n            <label for=\"password\">Password</label>\n        <input type=\"submit\" class=\"btn btn-primary w-100 btn-lg\" value=\"Sign in\">\n        <p>Not registered? <a href=\"/register\">Sign up</a></p>\n        <div class=\"form-alerts bottom\">\n            \n        </div>\n    </form>\n    \n</main>\n\n<div id=\"alerts\"></div>\n\n<div class=\"dark-mode\">\n    <input id=\"dark-mode-toggle\" type=\"checkbox\" name=\"dark-mode\">\n    <label for=\"dark-mode\">Dark mode</label>\n</div>\n\n<script src=\"/js/common.mjs\"></script>\n<script src=\"/js/login.js\" onload=\"init_login()\" ></script>\n\n")
    ; __line = 70
    ; __append( messagesuccess )
    ; __append("\n")
    ; __line = 71
    ; __append( messagefailure )
    ; __append("\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n</body>\n</html>\n\n")
    ; __line = 79
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}

ejs.views_register = function(locals, escapeFn, include = ejs.views_include(locals), rethrow
) {
rethrow = rethrow || function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
};
escapeFn = escapeFn || function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
;
var __line = 1
  , __lines = "<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n<% \nvar messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageSuccess}\", true)</script>` : '';\nvar messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),\"success\",\"${messageFailure}\", true)</script>` : '';\n%>\n\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Register</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/login_register.css\");\n    </style>\n</head>\n<body class=\"text-center\">\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n\n<main class=\"login-form\">\n    <div id=\"logo\"></div>\n\n    <form method=\"POST\" action=\"/auth/register\">\n        <h1 class=\"h3 mb-3 fw-normal\">Please register</h1>\n\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"text\" id=\"username\" name=\"username\" placeholder=\"Username\">\n            <label for=\"username\">Username</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required id=\"newPassword\" class=\"form-control\" type=\"password\" name=\"password\" placeholder=\"Password\">\n            <label for=\"newPassword\">Password</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required id=\"confirmPassword\" class=\"form-control\" type=\"password\" name=\"confirmPassword\" placeholder=\"Confirm password\">\n            <label for=\"confirmPassword\">Confirm password</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"text\" id=\"email\" name=\"email\" placeholder=\"email\">\n            <label for=\"email\">Email</label>\n        </div>\n\n        <input type=\"submit\" class=\"btn btn-primary w-100 btn-lg\" value=\"Sign up\">\n        <p>Already registered? <a href=\"/login\">Sign in</a></p>\n    </form>\n\n    </div>\n\n</form>\n\n</main>\n<div id=\"alerts\">\n    \n</div>\n\n<div class=\"dark-mode\">\n    <input id=\"dark-mode-toggle\" type=\"checkbox\" name=\"dark-mode\">\n    <label for=\"dark-mode\">Dark mode</label>\n</div>\n\n<script src=\"/js/common.mjs\"></script>\n<script onload=\"init_register()\" src=\"/js/register.js\"></script>\n\n<%- messagesuccess %>\n<%- messagefailure %>\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n</body>\n</html>"
  , __filename = undefined;
try {
  var __output = "";
  function __append(s) { if (s !== undefined && s !== null) __output += s }
  with (locals || {}) {
    ; __append("<!-- trying to fix white flashes when opening a page using dark mode-->\n<script>\n    if (localStorage.getItem(\"dark_mode\") == 'true') {\n        document.body.classList.add(\"dark-theme\")\n        document.querySelector(\"#dark-mode-toggle\").checked = true\n    } else {\n        document.body.classList.remove('dark-theme')\n        document.querySelector(\"#dark-mode-toggle\").checked = false\n    }\n</script>\n\n\n")
    ; __line = 13
    ;  
var messagesuccess = messageSuccess != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageSuccess}", true)</script>` : '';
var messagefailure = messageFailure != '' ? `<script>showAlert(document.querySelector('#alerts'),"success","${messageFailure}", true)</script>` : '';

    ; __line = 16
    ; __append("\n\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>DoX - Register</title>\n    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\"\n          integrity=\"sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3\" crossorigin=\"anonymous\">\n    <!-- SVG FontAwesome Icons -->\n    <script defer src=\"/media/fontawesome-free-5.15.4-web/js/all.js\"></script>\n    <style type=\"text/css\">\n        @import url(\"/css/common.css\");\n        @import url(\"/css/login_register.css\");\n    </style>\n</head>\n<body class=\"text-center\">\n<script src=\"/socket.io/socket.io.js\"></script>\n<script  onload=\"init_socket()\" src=\"/js/socket.js\"></script>\n\n\n<main class=\"login-form\">\n    <div id=\"logo\"></div>\n\n    <form method=\"POST\" action=\"/auth/register\">\n        <h1 class=\"h3 mb-3 fw-normal\">Please register</h1>\n\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"text\" id=\"username\" name=\"username\" placeholder=\"Username\">\n            <label for=\"username\">Username</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required id=\"newPassword\" class=\"form-control\" type=\"password\" name=\"password\" placeholder=\"Password\">\n            <label for=\"newPassword\">Password</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required id=\"confirmPassword\" class=\"form-control\" type=\"password\" name=\"confirmPassword\" placeholder=\"Confirm password\">\n            <label for=\"confirmPassword\">Confirm password</label>\n        </div>\n        <div class=\"form-floating\">\n            <input required class=\"form-control\" type=\"text\" id=\"email\" name=\"email\" placeholder=\"email\">\n            <label for=\"email\">Email</label>\n        </div>\n\n        <input type=\"submit\" class=\"btn btn-primary w-100 btn-lg\" value=\"Sign up\">\n        <p>Already registered? <a href=\"/login\">Sign in</a></p>\n    </form>\n\n    </div>\n\n</form>\n\n</main>\n<div id=\"alerts\">\n    \n</div>\n\n<div class=\"dark-mode\">\n    <input id=\"dark-mode-toggle\" type=\"checkbox\" name=\"dark-mode\">\n    <label for=\"dark-mode\">Dark mode</label>\n</div>\n\n<script src=\"/js/common.mjs\"></script>\n<script onload=\"init_register()\" src=\"/js/register.js\"></script>\n\n")
    ; __line = 82
    ; __append( messagesuccess )
    ; __append("\n")
    ; __line = 83
    ; __append( messagefailure )
    ; __append("\n\n<script src=\"https://code.jquery.com/jquery-3.2.1.slim.min.js\" integrity=\"sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN\" crossorigin=\"anonymous\"></script>\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js\" integrity=\"sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q\" crossorigin=\"anonymous\"></script>\n<script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js\" integrity=\"sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl\" crossorigin=\"anonymous\"></script>\n</body>\n</html>")
    ; __line = 89
  }
  return __output;
} catch (e) {
  rethrow(e, __lines, __filename, __line, escapeFn);
}

}