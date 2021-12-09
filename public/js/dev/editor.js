const {Plugin, EditorState} = require('prosemirror-state');
const {EditorView} = require('prosemirror-view');
const {undo, redo, history} = require('prosemirror-history');
const {keymap} = require('prosemirror-keymap');
const {baseKeymap, toggleMark, setBlockType, lift} = require('prosemirror-commands');
const {wrapInList, addListNodes, splitListItem, liftListItem} = require("prosemirror-schema-list");
const collab = require('prosemirror-collab');
const io = require('socket.io-client')
const schema = require('../../../modules/schema');
const {Step} = require("prosemirror-transform");

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
        let availableNodes = getAvailableBlockTypes(this.editorView, this.editorView.state.schema);

        // Update heading dropdown menu
        let currentLevel;
        // If availableNodes === [] the selection includes a list
        if (availableNodes.length !== 0)
            currentLevel = getCurrentHeaderLevel(this.editorView, this.editorView.state.schema.nodes.heading);
        else
            currentLevel = 'p';

        for (let item of this.items) {
            if (item.type === 'heading') {
                if (item.name === currentLevel) {
                    item.dom.classList.add('active');
                    document.getElementById('headingMenu').innerText = item.dom.innerText;
                } else {
                    item.dom.classList.remove('active');
                }
            } else if (item.type === 'mark') {
                if (activeMarks.includes(item.name))
                    item.dom.classList.add('active');
                else
                    item.dom.classList.remove('active');
            } else {
                // Will return false, if the command can't be executed
                if (!item.command(this.editorView.state, null, this.editorView)) {
                    item.dom.classList.add('disabled');
                } else {
                    item.dom.classList.remove('disabled');
                }
            }
        }
    }
}

//region Editor setup
let editor;

// Sockets
const socket = io({
    query: {
        documentID,
    }
})
socket.on('connect', () => {
    console.info('Socket connected');
})
socket.on('disconnect', () => {
    console.warn('Socket was disconnected')
})
socket.on('init', ({document, version}) => {
    console.info('Received INIT event. Version: ' + version);
    console.info(document);
    editor = initEditor(schema.nodeFromJSON(document), version);
})
socket.on('update', ({version, steps, stepClientIDs}) => {
    console.info(`Received UPDATE event. Version: ${version}. With data: `, steps, stepClientIDs);
    let currentVersion = collab.getVersion(editor.state);
    let newSteps = steps.slice(currentVersion).map(step => Step.fromJSON(schema, step));
    let newClientIDs = stepClientIDs.slice(currentVersion);

    editor.dispatch(
        collab.receiveTransaction(editor.state, newSteps, newClientIDs)
    )
})
socket.on('save-success', () => {
    console.info('Received SAVE-SUCCESS event');
    document.getElementById('button-save').innerHTML = '<i class="bi-save me-1"></i> Save';
    let messageSave = document.getElementById('message-save');

    messageSave.innerText = 'Saved successfully!';
    messageSave.classList.remove('text-danger');
    messageSave.classList.add('text-secondary');

    setTimeout(() => {
        messageSave.innerText = '';
    }, 5000)
})
socket.on('save-fail', ({error}) => {
    console.error('Received SAVE-FAIL event with data: ', error);
    document.getElementById('button-save').innerHTML = '<i class="bi-save me-1"></i> Save';
    let messageSave = document.getElementById('message-save');

    messageSave.classList.add('text-danger');
    messageSave.classList.remove('text-secondary');
    messageSave.innerText = 'Error occurred while saving!';
})

// Modals

// Insert image
document.getElementById('insertImageModal').addEventListener('shown.bs.modal', () => {
    document.getElementById('image-src').focus();
});
document.getElementById('insertImageModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('image-src').value = '';
    document.getElementById('image-alt').value = '';

    editor.focus();
});
document.getElementById('insert-image-form').addEventListener('submit', insertImage);
// Rename
document.getElementById('renameModal').addEventListener('shown.bs.modal', () => {
    document.getElementById('new-name').focus();
});
document.getElementById('renameModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('new-name').value = '';
    editor.focus();
});
document.getElementById('rename-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('renameModal'));

    let name = document.getElementById('new-name');
    let result = await fetch('/docs/' + documentID, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            tags: {
                title: name.value
            }
        })
    })

    if (!result.ok) {
        alert('Error occurred! Please try again');
        return;
    }

    document.getElementById('doc-title').innerText = name.value;
    document.querySelector('title').innerText = 'DoX - Edit - ' + name.value;

    name.value = '';
    name.placeholder = name.value;
    modal.hide();
});
// Insert link
document.getElementById('insertLinkModal').addEventListener('shown.bs.modal', () => {
    document.getElementById('link-href').focus();
})
document.getElementById('insertLinkModal').addEventListener('hidden.bs.modal', () => {
    document.getElementById('link-href').value = '';
    editor.focus();
})
document.getElementById('insert-link-form').addEventListener('submit', (e) => {
    e.preventDefault();
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('insertLinkModal'));

    toggleMark
    (editor.state.schema.marks.link, {href: document.getElementById('link-href').value})
    (editor.state, editor.dispatch);

    modal.hide();
})

// Document operations
document.getElementById('button-save').addEventListener('click', save);
document.getElementById('button-export').addEventListener('click', async () => {
    const title = document.getElementById('doc-title').innerText;
    editor.focus();
    html2pdf(document.querySelector('#editor > .ProseMirror'), {
        margin: [12, 15],
        filename: title + '.pdf',
        pagebreak: {mode: ['avoid-all']},
        image: {quality: 1}
    });
});

//endregion

// Functions
/**
 * Initializes an editor inside of the element with ID 'editor'.
 *
 * @param {Object} doc Document node
 * @param version
 */
function initEditor(doc, version) {
    // Menu setup
    let menu = menuPlugin([
        {
            name: 'undo',
            type: 'history',
            command: undo,
            dom: document.getElementById('action-undo')
        },
        {
            name: 'redo',
            type: 'history',
            command: redo,
            dom: document.getElementById('action-redo')
        },
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
        },
        {
            name: 'lift_item',
            type: 'list',
            command: liftListItem(schema.nodes.list_item),
            dom: document.getElementById('action-lift-item')
        }
    ])

    let state = EditorState.create({
        schema,
        doc,
        plugins: [
            collab.collab({version}),
            history(),
            keymap(buildKeymap(schema)),
            keymap(baseKeymap),
            menu
        ]
    })
    let editorView = new EditorView(document.getElementById("editor"),
        {
            state,
            dispatchTransaction(transaction) {
                // This function overwrites default transaction behaviour
                let newState = editorView.state.apply(transaction);
                editorView.updateState(newState);
                let sendable = collab.sendableSteps(newState);
                if (sendable) {
                    console.info('Emitting UPDATE event with data: ', sendable);
                    socket.emit('update', sendable);
                }
            }
        });

    editorView.focus();
    return editorView;
}

/**
 * Generates a keymap for the editor
 */
function buildKeymap(schema) {
    let keys = {}

    function bind(key, cmd) {
        keys[key] = cmd;
    }

    bind('Mod-s', save);

    bind('Mod-z', undo)
    bind('Mod-Shift-z', redo)

    bind('Mod-b', toggleMark(schema.marks.strong));
    bind('Mod-i', toggleMark(schema.marks.em));
    bind('Mod-u', toggleMark(schema.marks.underline));

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
 * Saves the document
 */
async function save() {
    document.getElementById('button-save').innerHTML = 'Saving...'
    socket.emit('save');
}

/**
 * Event listener for the insert image form submission
 * @param e Click event
 */
function insertImage(e) {
    e.preventDefault();
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('insertImageModal'));

    let src = document.getElementById('image-src');
    let alt = document.getElementById('image-alt');

    if (src.value === '') {
        alert('Please provide image source')
        return;
    }

    editor.dispatch(
        editor.state.tr.replaceSelectionWith(
            editor.state.schema.nodes.image.createAndFill({src: src.value, alt: alt.value}),
            false
        ));

    modal.hide();
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

/**
 * Check the current available node types
 * @author https://github.com/PierBover/
 */
function getAvailableBlockTypes(editorView, schema) {
    // get all the available nodeTypes in the schema
    const nodeTypes = schema.nodes;

    // iterate all the nodeTypes and check which ones can be applied
    return Object.keys(nodeTypes).filter((key) => {
        const nodeType = nodeTypes[key];
        // setBlockType() returns a function which returns false when a node can't be applied
        return setBlockType(nodeType)(editorView.state, null, editorView);
    });
}

/**
 * Returns current heading level
 * @param editorView
 * @param headingNode Heading node from schema
 * @returns {string} Level of header
 */
function getCurrentHeaderLevel(editorView, headingNode) {
    // Iterate through each available heading level (1-6)
    for (let i = 1; i <= 6; ++i) {
        // setBlockType() returns a function which returns false when a node can't be applied
        if (!setBlockType(headingNode, {level: i})(editorView.state, null, editorView))
            return 'h' + i;
    }

    // If the function hasn't return anything in the cycle, the selection isn't a heading
    return 'p';
}
