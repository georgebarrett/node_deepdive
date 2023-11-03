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

// this function returns a promise
readFilePromise(`${__dirname}/dog.txt`)
    .then(data => {
        console.log(`breed: ${data}`);

        return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    })
    .then(result => {
        console.log(result.body.message);

        return writeFilePromise('dogImage.txt', result.body.message);
    })
    .then(() => {
        console.log('random dog image saved to file');
    })
    .catch(err => {
        console.log(err.message);
    });