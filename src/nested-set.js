const Node = require('./node');
const deepEqual = require('deep-equal');

class NestedSet {

    constructor(data, options) {
        options = options || {};
        this.options = {};
        this.options.leftKey = options.leftKey || 'left';
        this.options.rightKey = options.rightKey || 'right';

        this.collection = [];
        this.indexes = {};

        this.load(data);
        return this;
    }

    load(data) {
        let self = this;

        // sort the set for deterministic order
        data.sort(function (a, b) {
            return a[self.options.leftKey] - b[self.options.leftKey];
        });

        // create an index
        for (let index in data) {
            if (!data.hasOwnProperty(index)) {
                continue;
            }
            let nodeRight = data[index][this.options.rightKey];
            this.indexes[nodeRight] = index;
        }

        for (let index in data) {
            if (!data.hasOwnProperty(index)) {
                continue;
            }
            this.collection[index] = new Node(data[index], this);
        }
    }

    getSize() {
        return this.collection.length;
    }

    getRoot() {
        for (let index in this.collection) {
            if (this.collection[index].isRoot()) {
                return this.collection[index];
            }
        }
        return false;
    }

    findSingleNode(partial, strict) {
        for (let index in this.collection) {
            if (!this.collection.hasOwnProperty(index)) {
                continue;
            } else if (deepEqual(this.collection[index].attributes, partial)) {
                return this.collection[index];
            }
        }
        return false;
    }

    toAdjacency() {
        let rootChild = this.getRoot();

        let _traveseChildren = function (parentNode, memo) {
            if (!parentNode.hasChildren()) return;

            memo.children = [];
            return parentNode.children().forEach(function (node) {
                let data = node.attributes;
                _traveseChildren(node, data);

                return memo.children.push(data);
            });
        }

        let data = rootChild.attributes;
        _traveseChildren(rootChild, data);

        return data;
    }
}

module.exports = NestedSet;
