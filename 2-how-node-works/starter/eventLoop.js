const fs = require('fs');

// this timer will expire after 0 seconds
setTimeout(() => console.log('timer 1 finished'), 0);

// this is another timer however a time out number is not specified because it is immediate
setImmediate(() => console.log('immediate 1 finished'));

// setImmediate finishes before setTimout when in the event loop callback function 
fs.readFile('test-file.txt', () => {
    console.log('io finished');
    console.log('-----------');

    setTimeout(() => console.log('timer 2 finished'), 0);
    setTimeout(() => console.log('timer 3 finished'), 3000);
    setImmediate(() => console.log('immediate 2 finished'));

    // nextTick should be called setImmediate and vice versa. nexTick will 
    // always be executed first within the event loop
    // ticks refer to the rotation through the event loop
    process.nextTick(() => console.log('process.next tick'));
});

console.log('hola from the top level');

