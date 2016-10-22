# Example

Working data set:
```javascript
var data = [{"title":"TUBE","description":null,"left":3,"right":4},{"title":"PLASMA","description":null,"left":7,"right":8},{"title":"MP3 PLAYERS","description":null,"left":11,"right":14},{"title":"GAME CONSOLES","description":null,"left":19,"right":20},{"title":"PORTABLE ELECTRONICS","description":null,"left":10,"right":21},{"title":"TELEVISIONS","description":null,"left":2,"right":9},{"title":"FLASH","description":null,"left":12,"right":13},{"title":"CD PLAYERS","description":null,"left":15,"right":16},{"title":"2 WAY RADIOS","description":null,"left":17,"right":18},{"title":"ELECTRONICS","description":null,"left":1,"right":22},{"title":"LCD","description":null,"left":5,"right":6}];
```

loading the data via constructor
```javascript
var tree = new NestedSet(data);
```

or reload the data using load method
```javascript
var tree = new NestedSet();
tree.load(data);
```

convert nested set to adjacency hierachies
```javascript
var tree = new NestedSet(data);
console.log(tree.toAdjacency());
```

