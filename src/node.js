class Node {

    constructor(data, context) {
        let self = this;
        let leftKey = context.options.leftKey;
        let rightKey = context.options.rightKey;

        this.context = context;
        this.left = data[leftKey];
        this.right = data[rightKey];
        this.attributes = {};

        Object.keys(data).forEach(function (prop) {
            if (prop === leftKey) return;
            if (prop === rightKey) return;
            self.attributes[prop] = data[prop];
        });

        return this;
    }

    parents() {
        let parents = [];
        let self = this;

        this.context.collection.map(function (node) {
            if (self.left <= node.left) return;
            if (self.right >= node.right) return;
            return parents.push(node);
        });

        return parents;
    }

    children() {
        let children = [];
        let right = this.right - 1;

        while (true) {
            if (right === this.left) {
                break;
            }

            let child = this.context.collection[
                this.context.indexes[right]
            ];
            children.push(child);
            right = child.left - 1;
        }

        return children.reverse();
    }

    descendants() {
        let descendants = [];
        let num_items = Math.floor((this.right - this.left) / 2);

        for (let right in this.context.indexes) {
            if (right < this.right && right > this.left) {
                let node = this.context.collection[
                    this.context.indexes[right]
                ];
                descendants.push(node);
            }
        }

        return descendants;
    }

    isLeaf() {
        return this.right === this.left + 1;
    }

    isRoot() {
        return this.depth() === 0;
    }

    isParent() {
        return false === this.isLeaf();
    }

    isDescendant() {
        return (this.left > 0) && (this.right < (this.context.getSize() * 2));
    }

    hasChildren() {
        return this.children().length > 0;
    }

    depth() {
        return this.parents().length;
    }
}

module.exports = Node;
