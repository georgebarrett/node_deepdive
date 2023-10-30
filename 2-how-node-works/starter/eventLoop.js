const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 1;

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
    // stick to either process.nextTick or setImmediate. setImmediate is favourable
    process.nextTick(() => console.log('process.next tick'));

    // these four password encryptions take the same amount of time due to node having four threads
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'password encrypted');
    });

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'password encrypted');
    });

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'password encrypted');
    });

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'password encrypted');
    });
});

console.log('hola from the top level');

