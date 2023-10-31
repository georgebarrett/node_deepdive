// importing an in-built node modules
const EventEmitter = require('events');
const http = require('http');

// this new Sales class inherits everything from the EventEmitter class
// Sales is the parent class. EventEmitter is the superclass
class Sales extends EventEmitter {
    
    constructor() {
        super();
    }
}

// this is storing a new instance of the parent sales class that inherits everything from the EventEmitter superclass
const myEmitter = new Sales();

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


/////////////////////////////////

// creating a new instance of an http server
const server = http.createServer();

// this is an event listener that is emitted every time the server receives a request
// the console records the request. when the server receives the request 'request received' appears on the localhost
server.on('request', (req, res) => {
    console.log('request received');
    console.log(req.url);
    res.end('request received');
});

// this is another event listener that will execute after the one above
server.on('request', (req, res) => {
    console.log('another request received');
});

// this closes the server. however there is no functionality inside the callback function that actually closes the server
server.on('close', () => {
    console.log('server closed')
});

// this starts the server
server.listen(8000, '127.0.0.1', () => {
    console.log('waiting for requests...')
});