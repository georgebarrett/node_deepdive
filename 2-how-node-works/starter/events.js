// importing a in-built node module
const EventEmitter = require('events');

// storing a new instance of the module in a variable 
const myEmitter = new EventEmitter();

// this is a callback action that occurs once the 'buy' button has been hit (observers)
myEmitter.on('newSale', () => {
    console.log('there was a new sale');
});

// this is a callback action that occurs once the 'buy' button has been hit (observers)
myEmitter.on('newSale', () => {
    console.log('customer name: Aphex Twin');
});

// this listner/callback function argument takes the value from the 'emit'
myEmitter.on('newSale', stock => {
    console.log(`there are now ${stock} items left in stock`);
});

// emitting an event called newSale. pretend it's for a customer who has just hit the 'buy' button
// i emmitted the 9 and then the 'on' listnener can pick up the value
myEmitter.emit('newSale', 9);



