!(function(global, factory) {
    "use strict";
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ?
            factory(global, true) :
            function(w) {
                if (!w.document) {
                    throw new Error("NestedSet requires a window with a document");
                }
                return factory(w);
            };
    } else {
        factory(global);
    }
    // Pass this if window is not defined yet
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    "use strict";

    var NestedSet = function(data, options) {
        options = options || {};
        this.options = {};
        this.options.leftKey = options.leftKey || 'left';
        this.options.rightKey = options.rightKey || 'right';

        this.collection = [];
        this.indexes = {};

        this.load(data);
        return this;
    }

    NestedSet.prototype.load = function(data) {
        var self = this;

        // sort the set for deterministic order
        data.sort(function(a, b) {
            return a[self.options.leftKey] - b[self.options.leftKey];
        });

        // create an index
        for (var index in data) {
            if (!data.hasOwnProperty(index)) {
                continue;
            }
            var nodeRight = data[index][this.options.rightKey];
            this.indexes[nodeRight] = index;
        }

        for (var index in data) {
            if (!data.hasOwnProperty(index)) {
                continue;
            }
            this.collection[index] = new Node(data[index], this);
        }
    }

    NestedSet.prototype.getSize = function() {
        return this.collection.length;
    }

    NestedSet.prototype.compareNodes = function(a, b, strict) {
        var strict = strict || false;

        if (a === b) {
            return true;
        }

        var keys = [
            Object.keys(a),
            Object.keys(b)
        ];

        if (strict && keys[0].length !== keys[1].length) {
            return false;
        }

        for (var i = 0; i <= keys[1].length; i++) {
            var prop = keys[1][i];

            if (a[prop] !== b[prop]) {
                return false;
            }
        }

        if (!strict) {
            return true;
        }

        for (var prop in keys[0]) {
            if (b[prop] !== undefined && a[prop] !== b[prop]) {
                return false;
            }

            if (typeof a[prop] === 'object' && this.compareNodes(a[prop], b[prop], true) === false) {
                return false;
            }
        }

        return true;
    }

    NestedSet.prototype.getRoot = function() {
        for (var index in this.collection) {
            if (this.collection[index].isRoot()) {
                return this.collection[index];
            }
        }
        return false;
    }

    NestedSet.prototype.findSingleNode = function(partial, strict) {
        for (var index in this.collection) {
            if (!this.collection.hasOwnProperty(index)) {
                continue;
            } else if (this.compareNodes(this.collection[index].attributes, partial, strict)) {
                return this.collection[index];
            }
        }
        return false;
    }

    NestedSet.prototype.toAdjacency = function() {
        var rootChild = this.getRoot();

        var _traveseChildren = function(parentNode, memo) {
            if (!parentNode.hasChildren()) return;

            memo.children = [];
            return parentNode.children().forEach(function(node) {
                var data = node.attributes;
                _traveseChildren(node, data);

                return memo.children.push(data);
            });
        }

        var data = rootChild.attributes;
        _traveseChildren(rootChild, data);

        return data;
    }

    var Node = function(data, context) {
        var self = this;
        var leftKey = context.options.leftKey;
        var rightKey = context.options.rightKey;

        this.context = context;
        this.left = data[leftKey];
        this.right = data[rightKey];
        this.attributes = {};

        Object.keys(data).forEach(function(prop) {
            if (prop === leftKey) return;
            if (prop === rightKey) return;
            self.attributes[prop] = data[prop];
        });

        return this;
    }

    Node.prototype.parents = function() {
        var parents = [];
        var self = this;

        this.context.collection.map(function(node) {
            if (self.left <= node.left) return;
            if (self.right >= node.right) return;
            return parents.push(node);
        });

        return parents;
    }

    Node.prototype.children = function() {
        var children = [];
        var right = this.right - 1;

        while (true) {
            if (right === this.left) {
                break;
            }

            var child = this.context.collection[
                this.context.indexes[right]
            ];
            children.push(child);
            right = child.left - 1;
        }

        return children.reverse();
    }

    Node.prototype.descendants = function() {
        var descendants = [];
        var num_items = Math.floor((this.right - this.left) / 2);

        for (var right in this.context.indexes) {
            if (right < this.right && right > this.left) {
                var node = this.context.collection[
                    this.context.indexes[right]
                ];
                descendants.push(node);
            }
        }

        return descendants;
    }

    Node.prototype.isLeaf = function() {
        return this.right === this.left + 1;
    }

    Node.prototype.isRoot = function() {
        return this.depth() === 0;
    }

    Node.prototype.isParent = function() {
        return false === this.isLeaf();
    }

    Node.prototype.isDescendant = function() {
        return (this.left > 0) && (this.right < (this.context.getSize() * 2));
    }

    Node.prototype.hasChildren = function() {
        return this.children().length > 0;
    }

    Node.prototype.depth = function() {
        return this.parents().length;
    }

    if (typeof define === "function" && define.amd) {
        define("NestedSet", [], function() {
            return NestedSet;
        });
    }

    if (!noGlobal) {
        window.NestedSet = NestedSet;
    }

    return NestedSet;
});
