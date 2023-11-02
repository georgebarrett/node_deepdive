const fs = require('fs');
const superagent = require('superagent');

// reading file and locating it using __dirname. using the console to print the text
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`breed: ${data}`);

    // solution 1
    
    // superagent module allows for get requests to api
    // without the .end method the request would not be finalised. the body refers to the random dog image
    
    // superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, result) => {
    //     console.log(result.body);
    // });

    // solution 2

    // this solution uses the .then method which is far more in vogue and prevents callback hell

    superagent
        .get(`https://dog.ceo/api/breed/${data}/images/random`)
        .end((err, result) => {
            // the result is the data retrieved. the body is the random image from the api
            // and the message refers to 'greyhound' in the dog.txt file 
            console.log(result.body.message);
        });
});