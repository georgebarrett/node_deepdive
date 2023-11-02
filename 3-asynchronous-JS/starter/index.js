const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`breed: ${data}`);

    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, result) => {
        console.log(result.body);
    });
});