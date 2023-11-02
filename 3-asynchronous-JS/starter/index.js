const fs = require('fs');
const superagent = require('superagent');

// reading file and locating it using __dirname. using the console to print the text
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`breed: ${data}`);

    // superagent module allows for get requests to api
    // without the .end method the request would not be finalised. the body refers to the random dog image
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, result) => {
        console.log(result.body);
    });
});