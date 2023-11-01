// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports

// i'm storing my calculator class in a variable called X. must be capital due to being a class 
const X = require('./testModuleOne');

// a new instance of my calculator class that is stored in the X variable
const calculator1 = new X();
// i can now use the newly made variable and invoke the methods from calculator class (X)
console.log(calculator1.add(2, 2));


// exports

const calculator2 = require('./testModuleTwo');
console.log(calculator2.multiply(10, 10));