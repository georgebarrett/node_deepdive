const fs = require('fs');
const http = require('http');

// const hello = 'hola mundo';
// console.log(hello);

// this is synchronous behaviour as the next line is dependent on the previous line executing
// const inputText = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(inputText); 

// const outputText = `This is what we know about the avocado: ${inputText}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', outputText);
// console.log('file written');

// non-blocking asynchronous behaviour
fs.readFile('./starter/txt/start.txt', 'utf-8', (error, data1) => {
    fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (error, data2) => {
        console.log(data2);
        fs.readFile('./starter/txt/append.txt', 'utf-8', (error, data3) => {
            console.log(data3);

            fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', error => {
                console.log('your file has been written');
            })
        });  
    });
});
console.log('will read file');