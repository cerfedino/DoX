const {Plugin, EditorState} = require('prosemirror-state');
const {EditorView, Decoration, DecorationSet} = require('prosemirror-view');
const {undo, redo, history} = require('prosemirror-history');
const {keymap} = require('prosemirror-keymap');
const {baseKeymap, toggleMark, setBlockType} = require('prosemirror-commands');
const {wrapInList, splitListItem, liftListItem} = require("prosemirror-schema-list");
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

        // Update color picker
        let pos = this.editorView.state.selection.$head;
        let color = '#000000'
        for (let mark of pos.marks()) {
            if (mark.type === schema.marks.color) {
                color = mark.attrs.color;
                break;
            }
        }
        document.getElementById('action-pick-color').value = color;
    }
}

//region Editor setup
let editor;
let connectedClients = {};

// Sockets
const socket = io()
socket.emit('doc-join-request', {_id: documentID});

socket.on('connect', () => {
    console.info('Socket connected');
})
socket.on('disconnect', () => {
    console.warn('Socket was disconnected')
    connectedClients = {};
    renderConnections();
    let activity = document.getElementById('active-users-button');
    activity.classList.remove('btn-primary');
    activity.classList.add('btn-warning');
    activity.innerText = 'You\'re offline!';
})
socket.on('init', (data) => {
    console.info('Received INIT event. Version: ' + data.version);
    console.info(data.document);
    editor = initEditor(schema.nodeFromJSON(data.document), data.version);

    for (let client of Object.entries(data.connected)) {
        connectedClients[client[0]] = {
            userID: client[1].userID,
            permission: client[1].permission,
            selection: client[1].selection ? client[1].selection : {
                from: 1,
                to: 1
            },
            colors: pickColor()
        }
    }
    renderConnections();

    editor.dispatch(
        editor.state.tr.setMeta('update-selections', true)
    )
})
socket.on('client-connect', data => {
    connectedClients[data.id] = {
        userID: data.userID,
        permission: data.permission,
        colors: pickColor()
    }
    renderConnections();
})
socket.on('client-disconnect', id => {
    delete connectedClients[id];
    renderConnections();
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
    //document.getElementById('button-save').innerHTML = '<i class="bi-save me-1"></i> Save';
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
    //document.getElementById('button-save').innerHTML = '<i class="bi-save me-1"></i> Save';
    let messageSave = document.getElementById('message-save');

    messageSave.classList.add('text-danger');
    messageSave.classList.remove('text-secondary');
    messageSave.innerText = 'Error occurred while saving!';
})
socket.on('notify-update', ({data}) => {
    console.info('Received NOTIFY-UPDATE event');
    if (!data.title) return;

    document.getElementById('new-name').value = data.title;
    document.getElementById('doc-title').innerText = data.title;
    document.querySelector('title').innerText = 'DoX - Edit - ' + data.title;
})
socket.on('selection-changed', connected => {
    let entries = Object.entries(connected);
    for (let entry of entries) {
        if (!connectedClients[entry[0]]) {
            console.warn('Received data about unknown client ' + entry[0]);
            continue;
        }

        connectedClients[entry[0]].selection = entry[1].selection ? entry[1].selection : {
            from: 1,
            to: 1
        }
    }

    editor.dispatch(
        editor.state.tr.setMeta('update-selections', true)
    )
})

function SelectionUpdater() {
    return new Plugin({
        state: {
            init() {

            },
            apply(tr, _, old) {
                // Check if the selection has changed after the transaction
                if (tr.selection.from !== old.tr.selection.from || tr.selection.to !== old.tr.selection.to) {
                    socket.emit('selection-changed', {
                        from: tr.selection.anchor,
                        to: tr.selection.head
                    })
                    return;
                }

                if (tr.getMeta('update-selections')) {
                    let decos = [];
                    for (let clientData of Object.entries(connectedClients)) {
                        if (clientData[0] === socket.id) continue;

                        // As we send anchor and head instead of from and to, we should perform an additional check
                        let from = clientData[1].selection.from < clientData[1].selection.to ?
                            clientData[1].selection.from : clientData[1].selection.to;
                        let to = clientData[1].selection.from > clientData[1].selection.to ?
                            clientData[1].selection.from : clientData[1].selection.to;
                        decos.push(Decoration.inline(
                            from,
                            to,
                            {style: `background-color: ${clientData[1].colors[0]}; color: ${clientData[1].colors[1]}`}
                        ))
                    }

                    return DecorationSet.create(tr.doc, decos);
                }
            }
        },
        props: {
            decorations(state) {
                return this.getState(state);
            }
        }
    });
}

let colorIndex = -1;

function pickColor() {
    let palette = [
        ['#ff7070', '#6b0000'], // Red
        ['#70ff70', '#006b00'], // Green
        ['#7070ff', '#00006b'], // Blue
        ['#ffff70', '#6b6b00'], // Yellow
        ['#ff70ff', '#6b006b'], // Purple
        ['#70ffff', '#006b6b'], // Cyan
    ]
    colorIndex += 1;
    if (colorIndex >= palette.length || colorIndex < 0) colorIndex = 0;
    return palette[colorIndex];
}

function renderConnections() {
    let active = document.getElementById('active-users');
    let newHTML = '';
    for (let client of Object.values(connectedClients)) {
        newHTML +=
            `<li><span style="color: ${client.colors[1]}" class="dropdown-item-text"><b>${client.userID}</b> - ${client.permission}</span></li>`;
        newHTML +=
            '<li class="dropdown-divider"></li>';
    }
    newHTML += `<li class="dropdown-item-text"><b>Connected: ${Object.values(connectedClients).length}</b></li>`
    active.innerHTML = newHTML;

    document.getElementById('active-users-button').innerText = 'Active: ' + Object.values(connectedClients).length;
}

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
    editor.focus();
});
document.getElementById('rename-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    let name = document.getElementById('new-name');
    let modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('renameModal'));

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
// Change color
document.getElementById('action-pick-color').addEventListener('change', (e) => {
    toggleColor(e.target.value)(editor.state, editor.dispatch);
    editor.focus();
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
            SelectionUpdater(),
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

    bind('Mod-Shift-7', wrapInList(schema.nodes.ordered_list, {level: 1}));
    bind('Mod-Shift-8', wrapInList(schema.nodes.bullet_list, {}));

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

function markApplies(doc, ranges, type) {
    for (let i = 0; i < ranges.length; i++) {
        let {$from, $to} = ranges[i]
        let can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false
        doc.nodesBetween($from.pos, $to.pos, node => {
            if (can) return false
            can = node.inlineContent && node.type.allowsMarkType(type)
        })
        if (can) return true
    }
    return false
}

/**
 * Toggles color mark on the current selection
 * @param color Color for the style attribute
 * @returns {(function(*, *): (boolean))|*} Command
 */
function toggleColor(color) {
    const markType = schema.marks.color;
    const attrs = {color}
    return function (state, dispatch) {
        let {empty, $cursor, ranges} = state.selection
        if ((empty && !$cursor) || !markApplies(state.doc, ranges, markType)) return false
        if (dispatch) {
            if ($cursor) {
                let tr = state.tr;
                if (markType.isInSet(state.storedMarks || $cursor.marks()))
                    tr.removeStoredMark(markType) // Remove existing color
                dispatch(tr.addStoredMark(markType.create(attrs)))
            } else {
                let has = false, tr = state.tr
                for (let i = 0; !has && i < ranges.length; i++) {
                    let {$from, $to} = ranges[i]
                    has = state.doc.rangeHasMark($from.pos, $to.pos, markType)
                }
                for (let i = 0; i < ranges.length; i++) {
                    let {$from, $to} = ranges[i]
                    if (has) {
                        tr.removeMark($from.pos, $to.pos, markType)
                    }

                    let from = $from.pos, to = $to.pos, start = $from.nodeAfter, end = $to.nodeBefore
                    let spaceStart = start && start.isText ? /^\s*/.exec(start.text)[0].length : 0
                    let spaceEnd = end && end.isText ? /\s*$/.exec(end.text)[0].length : 0
                    if (from + spaceStart < to) {
                        from += spaceStart;
                        to -= spaceEnd
                    }
                    tr.addMark(from, to, markType.create(attrs))
                }
                dispatch(tr.scrollIntoView())
            }
        }
        return true
    }
}
