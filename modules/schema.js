const {addListNodes} = require("prosemirror-schema-list");
const basicSchema = require("prosemirror-schema-basic");
const {Schema} = require("prosemirror-model");

const spec = {
    nodes: {
        ...basicSchema.nodes,
    },
    marks: {
        ...basicSchema.marks,
        color: {
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
        },
        fontSize: {
            attrs: {
                size: {default: '16px'}
            },
            toDOM(node) {
                return ['span', {class: 'font-size', style: 'font-size: ' + node.attrs.size}]
            },
            parseDOM: [{
                tag: 'span.font-size',
                getAttrs(dom) {
                    return {
                        size: dom.style.split(': ')[1],
                    }
                }
            }]
        },
        underline: {
            toDOM() {
                return ['u', 0]
            },
            parseDOM: [{tag: 'u'}]
        }
    }
}

spec.nodes.heading.marks = 'link em strong underline color'

const base = new Schema(spec);
const schema = new Schema({
    nodes: addListNodes(base.spec.nodes, 'paragraph block*', 'block'),
    marks: base.spec.marks
});

module.exports = schema;