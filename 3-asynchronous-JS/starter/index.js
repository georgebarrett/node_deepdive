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
    // the callback function within the .then also returns a promise
    .then(data => {
        console.log(`breed: ${data}`);

    // solution 1

    // superagent module allows for get requests to api
    // without the .end method the request would not be finalised. the body refers to the random dog image

    // superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, result) => {
    //     console.log(result.body);
    // });

    // solution 2

    // this solution uses the .then method which is far more in vogue and prevents callback hell

        return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
    })
        // this .then is chained onto the last. the result is the value of the first resolved promise
        .then(result => {
        
            // always do error handling at the beginning
            // the return stops any further code from being executed
            // this error handler is not actually needed due to the catch block below
            // if (err) return console.log('this dog breed does not exist');

            // the result is the data retrieved. the body is the random image from the api
            // and the message refers to 'greyhound' in the dog.txt file 
            console.log(result.body.message);

            return writeFilePromise('dogImage.txt', result.body.message);

            // i am creating a new file with th write file method and then saying what i want in it
            // fs.writeFile('dogImage.txt', result.body.message, err => {
            // if (err) return console.log('dog image could not be saved');
            // console.log('random dog image saved to file');
            // });
        // it is great having a .catch because it clearly seperates what i want to happen from the error handling
        })
        .then(() => {
            console.log('random dog image saved to file');
        })
        .catch(err => {
            console.log(err.message);
        });