// importing a in-built node module
const EventEmitter = require('events');

// storing a new instance of the module in a variable 
const myEmitter = new EventEmitter();

// this is a callback action that occur once the 'buy' button has been hit
myEmitter.on('newSale', () => {
    console.log('there was a new sale');
});

// this is a callback action that occur once the 'buy' button has been hit
myEmitter.on('newSale', () => {
    console.log('customer name: Aphex Twin');
});

// emitting an event called newSale. pretend it's for a customer who has just hit the 'buy' button
myEmitter.emit('newSale');



