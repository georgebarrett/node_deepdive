const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent');

// this function, behind the scenes reads the file with rs but then returns a promise, which can be
// used instead of a call back function
const readFilePromise = (file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            // error handler first. this is connected to the .catch method
            if (err) reject('no file located');

            // the data is the value that the resolve returns aka if the .then is successful
            // resolve is when a promise has been fulfiled, reject is the opposite
            resolve(data);
        });
    });
}

const writeFilePromise = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if (err) reject('the file has not been saved');
            // a promise does not have to always return a meaningful value
            resolve('success');
        });
    });
}


const getDogPicture = async () => {
    try {
        // the function will wait for the file to be fully read before storing it inside the data variable
        const data = await readFilePromise(`${__dirname}/dog.txt`);
        console.log(`breed: ${data}`);
    
        const result = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        console.log(result.body.message);
    
        // no need for a variable because nothing meaningful is being returned. it's just being saved
        await writeFilePromise('dogImage.txt', result.body.message);
        console.log('random dog image saved to file');
    } catch (err) {
        console.log(err);
    }   
}

getDogPicture();


// reference for using only .thens and callbacks

// readFilePromise(`${__dirname}/dog.txt`)
//     .then(data => {
//         console.log(`breed: ${data}`);

//         return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     })
//     .then(result => {
//         console.log(result.body.message);

//         return writeFilePromise('dogImage.txt', result.body.message);
//     })
//     .then(() => {
//         console.log('random dog image saved to file');
//     })
//     .catch(err => {
//         console.log(err.message);
//     });