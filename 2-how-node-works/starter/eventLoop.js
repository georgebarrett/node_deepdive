const fs = require('fs');

// this timer will expire after 0 seconds
setTimeout(() => console.log('timer 1 finished'), 0);

// this is another timer however a time out number is not specified because it is immediate
setImmediate(() => console.log('immediate 1 finished'));

fs.readFile('test-file.txt', () => {
    console.log('io finished')
});

console.log('hola from the top level');

