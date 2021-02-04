class Node {

    constructor(data, context) {
        let leftKey = context.options.leftKey
        let rightKey = context.options.rightKey

        this.context = context
        this.left = _.get(data, leftKey, -1)
        this.right = _.get(data, rightKey, -1)
        this.attributes = _.omit(data, [leftKey, rightKey])

        return this
    }

    parents() {
        let parents = []

        _.forEach(this.context.collection, (node, index) => {
            if (this.left <= node.left) return
            if (this.right >= node.right) return
            return parents.push(node)
        })

        return parents
    }

    children() {
        let children = []
        let right = this.right - 1

        while (true) {
            if (right === this.left) { break }

            let child = _.get(
                this.context.collection,
                _.get(this.context.indexes, right),
            )
            if (!child) { break }

            children.push(child)
            right = child.left - 1
        }

        return children.reverse()
    }

    descendants() {
        let descendants = []

        _.forEach(this.context.indexes, (index, right) => {
            right = _.parseInt(right)

            if (right < this.right && right > this.left) {
                let node = _.get(
                    this.context.collection,
                    _.get(this.context.indexes, right),
                )
                descendants.push(node)
            }
        })

        return descendants
    }

    isLeaf() {
        return _.isEqual(this.right, this.left + 1)
    }

    isRoot() {
        return _.isEqual(this.depth(), 0)
    }

    isParent() {
        return _.isEqual(this.isLeaf(), false)
    }

    isDescendant() {
        return (this.left > 0) && (this.right < (this.context.getSize() * 2))
    }

    hasChildren() {
        return _.size(this.children() || []) > 0
    }

    depth() {
        return _.size(this.parents() || [])
    }
}

module.exports = Node
