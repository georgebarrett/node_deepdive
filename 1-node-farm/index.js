const fs = require('fs');
const http = require('http');
const url = require('url');


// FILES


// const hello = 'hola mundo';
// console.log(hello);

// this is synchronous behaviour as the next line is dependent on the previous line executing
// const inputText = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(inputText); 

// const outputText = `This is what we know about the avocado: ${inputText}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', outputText);
// console.log('file written');

// non-blocking asynchronous behaviour
// fs.readFile('./starter/txt/start.txt', 'utf-8', (error, data1) => {
//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (error, data2) => {
//         console.log(data2);
//         fs.readFile('./starter/txt/append.txt', 'utf-8', (error, data3) => {
//             console.log(data3);

//             fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', error => {
//                 console.log('your file has been written');
//             })
//         });  
//     });
// });
// console.log('will read file');


// SERVER

// creating a server that provides a response. this server is stored in a variable
const server = http.createServer((req, res) => {
    const pathName = req.url

    if (pathName === '/' || pathName === '/overview') {
        res.end('this is the overview');
    } else if (pathName === '/product') {
        res.end('this is the product');
    } else {
        res.writeHead(404, {
            'content-type': 'text/html'
        });
        res.end('<h1>page not found</h1>');
    }
});

// i can call the server variable. the call back function will fire when the server starts listening and not before
server.listen(8000, '127.0.0.1', () => {
    console.log('listening to requests on port 8000');
});


