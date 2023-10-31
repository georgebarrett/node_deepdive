// importing a in-built node module
const EventEmitter = require('events');

// storing a new instance of the module in a variable 
const myEmitter = new EventEmitter();

// 
myEmitter.on('newSale', () => {
    console.log('there was a new sale');
});

myEmitter.on('newSale', () => {
    console.log('customer name: Aphex Twin');
});

// emitting an event called newSale
myEmitter.emit('newSale');



