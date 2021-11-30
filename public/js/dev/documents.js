const {schema} = require('prosemirror-schema-basic');
const {EditorState} = require('prosemirror-state');
const {EditorView} = require('prosemirror-view')

let state = EditorState.create({schema});
let view = new EditorView(document.getElementById("editor"), {state});

document.querySelector("#dark-mode-toggle").addEventListener('change',
    function () {
        if (this.checked)
            document.body.classList.add("dark-theme")
        else
            document.body.classList.remove('dark-theme')
    });
