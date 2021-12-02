const {Schema} = require('prosemirror-model');
const {Plugin, EditorState} = require('prosemirror-state');
const {EditorView} = require('prosemirror-view');
const {undo, redo, history} = require('prosemirror-history');
const {keymap} = require('prosemirror-keymap');
const {baseKeymap, toggleMark, setBlockType} = require('prosemirror-commands');
const basicSchema = require('prosemirror-schema-basic')
const {wrapInList, addListNodes, splitListItem} = require("prosemirror-schema-list");

/**
 * Menu component
 */
class MenuView {
    constructor(items, editorView) {
        /**
         * Array of objects with name, type, command and dom roperties.
         * @type {Array}
         */
        this.items = items;
        this.editorView = editorView;

        this.dom = document.getElementById('actions');
        this.update();

        this.dom.addEventListener("mousedown", e => {
            e.preventDefault();
            editorView.focus();
            items.forEach(({command, dom}) => {
                if (dom.contains(e.target))
                    command(editorView.state, editorView.dispatch, editorView);
            })
        })
    }

    update() {
        let activeMarks = getActiveMarkCodes(this.editorView);
        console.log(activeMarks);
        this.items.forEach(item => {
            if (item.type === 'mark') {
                if (activeMarks.includes(item.name)) item.dom.classList.add('active');
                else item.dom.classList.remove('active');
            } else if (item.type === 'heading') {
                let inactive = item.command(this.editorView.state, null, this.editorView)
                if (!inactive) {
                    item.dom.classList.add('active');
                    document.getElementById('headingMenu').innerText = item.dom.innerText;
                } else {
                    item.dom.classList.remove('active');
                }
            } else if (item.type === 'list') {

            }
        });
    }
}

initEditor();

function initEditor() {
    /*let schema = new Schema({
        nodes: {
            text: {
                group: 'inline',
                inline: true
            },
            paragraph: {
                group: 'block',
                content: 'text*',
                toDOM() {
                    return ['p', 0]
                },
                parseDOM: [{tag: 'p'}]
            },
            heading: {
                group: 'block',
                content: 'text*',
                attrs: {
                    level: 1
                },
                toDOM(node) {
                    return ['h' + node.attrs.level, 0]
                },
                parseDOM: [
                    {tag: 'h1', attrs: {level: 1}},
                    {tag: 'h2', attrs: {level: 2}},
                    {tag: 'h3', attrs: {level: 3}},
                    {tag: 'h4', attrs: {level: 4}},
                    {tag: 'h5', attrs: {level: 5}},
                    {tag: 'h6', attrs: {level: 6}}
                ]
            },
            doc: {
                content: '(block)+'
            },
        },
        marks: {
            strong: {
                toDOM() {
                    return ['strong', 0]
                },
                parseDOM: [{tag: 'strong'}]
            },
            em: {
                toDOM() {
                    return ['em', 0]
                },
                parseDOM: [{tag: 'em'}]
            },
            underline: {
                toDOM() {
                    return ['u', 0]
                },
                parseDOM: [{tag: 'u'}]
            }
        }
    })*/

    let schema = new Schema({
        nodes: addListNodes(basicSchema.schema.spec.nodes, 'paragraph block*', 'block'),
        marks: basicSchema.schema.spec.marks
    })

    let menu = menuPlugin([
        {
            name: 'strong',
            type: 'mark',
            command: toggleMark(schema.marks.strong),
            dom: document.getElementById('action-bold')
        },
        {
            name: 'em',
            type: 'mark',
            command: toggleMark(schema.marks.em),
            dom: document.getElementById('action-italic')
        },
        {
            name: 'underline',
            type: 'mark',
            command: toggleMark(schema.marks.underline),
            dom: document.getElementById('action-underline')
        },
        {
            name: 'p',
            type: 'heading',
            command: setBlockType(schema.nodes.paragraph),
            dom: document.getElementById('action-p')
        },
        {
            name: 'h1',
            type: 'heading',
            command: setBlockType(schema.nodes.heading, {level: 1}),
            dom: document.getElementById('action-h1')
        },
        {
            name: 'h2',
            type: 'heading',
            command: setBlockType(schema.nodes.heading, {level: 2}),
            dom: document.getElementById('action-h2')
        },
        {
            name: 'h3',
            type: 'heading',
            command: setBlockType(schema.nodes.heading, {level: 3}),
            dom: document.getElementById('action-h3')
        },
        {
            name: 'h4',
            type: 'heading',
            command: setBlockType(schema.nodes.heading, {level: 4}),
            dom: document.getElementById('action-h4')
        },
        {
            name: 'h5',
            type: 'heading',
            command: setBlockType(schema.nodes.heading, {level: 5}),
            dom: document.getElementById('action-h5')
        },
        {
            name: 'h6',
            type: 'heading',
            command: setBlockType(schema.nodes.heading, {level: 6}),
            dom: document.getElementById('action-h6')
        },
        {
            name: 'bullet_list',
            type: 'list',
            command: wrapInList(schema.nodes.bullet_list, {}),
            dom: document.getElementById('action-bullet-list')
        },
        {
            name: 'ordered_list',
            type: 'list',
            command: wrapInList(schema.nodes.ordered_list, {level: 1}),
            dom: document.getElementById('action-ordered-list')
        }
    ])

    let state = EditorState.create({
        schema,
        plugins: [
            history(),
            keymap(buildKeymap(schema)),
            keymap(baseKeymap),
            menu
        ]
    });
    let editorView = new EditorView(document.getElementById("editor"), {state});

    editorView.focus();
}

function buildKeymap(schema) {
    let keys = {}
    function bind(key, cmd) {
        keys[key] = cmd;
    }

    bind('Mod-z', undo)
    bind('Shift-Mod-z', redo)

    bind('Mod-b', toggleMark(schema.marks.strong));
    bind('Mod-i', toggleMark(schema.marks.em));
    // underline

    bind('Enter', splitListItem(schema.nodes.list_item));

    return keys;
}

/**
 * Plugin view for the editor
 * @param items Array of objects with command and dom properties
 * @returns {MenuView|Plugin}
 */
function menuPlugin(items) {
    return new Plugin({
        view(editorView) {
            return new MenuView(items, editorView);
        }
    })
}

/**
 * Gets active marks on the current selection
 * @author https://github.com/PierBover/
 */
function getActiveMarkCodes(view) {
    const isEmpty = view.state.selection.empty;
    const state = view.state;

    if (isEmpty) {
        const $from = view.state.selection.$from;
        const storedMarks = state.storedMarks;

        // Return either the stored marks, or the marks at the cursor position.
        // Stored marks are the marks that are going to be applied to the next input
        // if you dispatched a mark toggle with an empty cursor.
        if (storedMarks) {
            return storedMarks.map((mark) => mark.type.name);
        } else {
            return $from.marks().map((mark) => mark.type.name);
        }
    } else {
        const $head = view.state.selection.$head;
        const $anchor = view.state.selection.$anchor;

        // We're using a Set to not get duplicate values
        const activeMarks = new Set();

        // Here we're getting the marks at the head and anchor of the selection
        $head.marks().forEach((mark) => activeMarks.add(mark.type.name));
        $anchor.marks().forEach((mark) => activeMarks.add(mark.type.name));

        return Array.from(activeMarks);
    }
}

// Dark mode
document.querySelector("#dark-mode-toggle").addEventListener('change',
    function () {
        if (this.checked)
            document.body.classList.add("dark-theme")
        else
            document.body.classList.remove('dark-theme')
    });
