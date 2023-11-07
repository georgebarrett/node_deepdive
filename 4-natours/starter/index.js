const fs = require('fs');
const express = require('express');

const app = express();

// once the home page url has been hit. the callback function will fire
// app.get('/', (req, res) => {
//     // using the response object to send a json object. the .json method is a send method
//     res.status(200).json({
//         message: 'come to the Serverside Luke',
//         app: 'Natours'
//     });
// });

// app.post('/', (req, res) => {
//     res.send('you can post stuff to this endpoint...')
// });

// JSON.parse means the json from the file will automatically be converted into a javascript object
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// by adding v1, i can work on v2 without messing with the original request setup
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        // the status of the get request
        status: 'success',
        // data: is an envelope that contains the actual data response object
        data: {
            // key/url endpoint and value/tours variable
            tours: tours
        }
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`${port}...`)
});