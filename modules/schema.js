const {addListNodes} = require("prosemirror-schema-list");
const basicSchema = require("prosemirror-schema-basic");
const {Schema} = require("prosemirror-model");

// Base scheme loaded from prosemirror-scheme-basic and prosemirror-scheme-list
let base = {
    nodes: addListNodes(basicSchema.schema.spec.nodes, 'paragraph block*', 'block'),
    marks: basicSchema.schema.spec.marks
}

base.marks = base.marks.addToEnd('color', {
    attrs: {
        color: {default: '#000'}
    },
    toDOM(node) {
        return ['span', {class: 'color', style: 'color: ' + node.attrs.color}]
    },
    parseDOM: [{
        tag: 'span.color',
        getAttrs(dom) {
            return {
                color: dom.style.split(': ')[1], // 'style="color: #fff", will return #fff
            }
        }
    }]
});
base.marks = base.marks.addToEnd('underline', {
    toDOM() {
        return ['u', 0]
    },
    parseDOM: [{tag: 'u'}]
})
let schema = new Schema(base);

module.exports = schema;