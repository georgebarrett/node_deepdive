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


// reading the files synchonously. these are only executed once right at the beginning. each read file is sotred in a variable
const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const templateOverview = fs.readFileSync(`${__dirname}/starter/templates/overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/starter/templates/card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/starter/templates/product.html`, 'utf-8');

// storing the json data in a new variable dataObject
const dataObject = JSON.parse(data);

// creating a server that provides a response. this server is stored in a variable
const server = http.createServer((req, res) => {
    const pathName = req.url;

    // overview page
    if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });   
    res.end(templateOverview);

    // product page
    } else if (pathName === '/product') {
        res.end('this is the product');

    //  api page
    } else if (pathName === '/api') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(data);

    // error handler
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


