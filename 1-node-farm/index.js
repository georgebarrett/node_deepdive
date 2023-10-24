// storing the file system module in a variable that can be used 
const fs = require('fs');

// const hello = 'hola mundo';
// console.log(hello);

const inputText = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
console.log(inputText); 

const outputText = `This is what we know about the avocado: ${inputText}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./starter/txt/output.txt', outputText);
console.log('File written');