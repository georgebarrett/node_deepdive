const fs = require('fs');
const express = require('express');
const { request } = require('http');

const app = express();

// express.json is middleware so that data from the client side can be attached to request objects
app.use(express.json());

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
        // providing the length of the tours makes it easy for a programmer to see the quantity
        results: tours.length,
        // data: is an envelope that contains the actual data response object
        data: {
            // key/url endpoint and value/tours variable
            tours: tours
        }
    });
});

// the : creates a variable called id
app.get('/api/v1/tours/:id', (req, res) => {
    // the params refer to the variables stored un the url :id
    // /api/v1/tours/5 will automatically asign the :id variable to 5
    console.log(req.params);

    // req.params.id returns a string with the id number inside
    // by multiplying the string by one, it will convert the string to an integer
    const id = req.params.id * 1;

    // SOLUTION 1
    // if (id > tours.length) {
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'invalid id'
    //     });
    // }

    // .find creates a new array with the tour that matches the tour in the params
    const tour = tours.find(element => element.id === id);

    // SOLUTION 2
    // because the tour variable maps through all the tours using .find, if there is no match
    // then the error can be handled like this...
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour
        }
    });
});

// the request object is what holds all the data that is been posted
app.post('/api/v1/tours', (req, res) => {
    // body refers to the object data that is attached to the request
    // console.log(req.body);

    // because there is no database and the data is coming from a regular .js file
    // use the [tours.length - 1] to find the last posted tour object
    // the .id accesses the id of the last tour object
    // the + 1 generates a 
    const newId = tours[tours.length - 1].id + 1

    // object.assign allows for creation of a new object by merging two existing objects together
    // the new object tour has been created and stored in newTour
    const newTour = Object.assign({ id: newId }, req.body);

    // the tours array now has the new tour pushed in with its id
    tours.push(newTour);

    // writeFileSync would block the event loop!
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        // status 201 means created
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`${port}...`)
});