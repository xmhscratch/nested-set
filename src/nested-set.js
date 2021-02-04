const Node = require('./node')
const deepEqual = require('deep-equal')

class NestedSet {

    constructor(data, options) {
        options = options || {}

        this.options = {}
        this.options.leftKey = options.leftKey || 'left'
        this.options.rightKey = options.rightKey || 'right'

        this.collection = []
        this.indexes = {}

        this.load(data)
        return this
    }

    load(data) {
        // sort the set for deterministic order
        _.sortBy(data, (o) => {
            return _.get(o, this.options.leftKey, 0)
        })

        // data.sort(function (a, b) {
        //     return a[self.options.leftKey] - b[self.options.leftKey]
        // })

        // create an index
        _.forEach(data, (value, index) => {
            if (!data.hasOwnProperty(index)) { return }
            let nodeRight = _.get(value, this.options.rightKey, 0)
            this.indexes = _.assignIn({}, this.indexes, {
                [nodeRight]: index,
            })
            this.collection = _.assignIn({}, this.collection, {
                [index]: new Node(value, this),
            })
        })
    }

    getSize() {
        return _.size(this.collection)
    }

    getRoot() {
        return _
            .chain(this.collection)
            .filter(function (node) {
                return node.isRoot()
            })
            .first()
            .value()
    }

    findSingleNode(partial, strict) {
        return _
            .chain(this.collection)
            .filter(function (node) {
                return deepEqual(node.attributes, partial)
            })
            .first()
            .value()
    }

    toAdjacency() {
        let rootChild = this.getRoot()

        let _traveseChildren = function (parentNode, memo) {
            if (!parentNode.hasChildren()) { return }

            memo.children = []
            return parentNode.children().forEach(function (node) {
                let data = node.attributes
                _traveseChildren(node, data)

                return memo.children.push(data)
            })
        }

        let data = rootChild.attributes
        _traveseChildren(rootChild, data)

        return data
    }
}

module.exports = NestedSet
