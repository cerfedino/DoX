const {schema} = require('prosemirror-schema-basic');
const {EditorState} = require('prosemirror-state');
const {EditorView} = require('prosemirror-view');
const {undo, redo, history} = require('prosemirror-history');
const {keymap} = require('prosemirror-keymap');
const {baseKeymap} = require('prosemirror-commands');

let state = EditorState.create({
    schema,
    plugins: [
        history(),
        keymap({'Mod-z': undo, 'Mod-y': redo}),
        keymap(baseKeymap)
    ]
});
let view = new EditorView(document.getElementById("editor"), {state});

view.focus();

// Dark mode
document.querySelector("#dark-mode-toggle").addEventListener('change',
    function () {
        if (this.checked)
            document.body.classList.add("dark-theme")
        else
            document.body.classList.remove('dark-theme')
    });
