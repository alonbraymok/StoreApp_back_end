var createCountMinSketch = require("count-min-sketch")
const User = require('../../models/Users');


//Create data structure
var sketch = createCountMinSketch()

var user = [];

User.find

//Increment counter
for(i=0;i<100;i++){
sketch.update("foo", 1)
sketch.update(1515, 104)
}

//Query results
console.log(sketch.query(1515))  //Prints 104
console.log(sketch.query("foo")) //Prints 1