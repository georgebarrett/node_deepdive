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

// this is the same as above but without using a class
// const calculator2 = require('./testModuleTwo');

// this module import has been deconstructed using the {}. this means i can call functions direct
const { add, subtract, multiply, divide } = require('./testModuleTwo');
console.log(multiply(10, 10));


// caching

// this returns the function that i defined testModuleThree.js
// there is a top level console.log in testModuleThree.js. this only shows once despite
// the require being called three times. however, the function in testModule Three fires
// three times due to it being invoked three times () aka the function was cached but the top level
// code was not
require('./testModuleThree')();
require('./testModuleThree')();
require('./testModuleThree')();
