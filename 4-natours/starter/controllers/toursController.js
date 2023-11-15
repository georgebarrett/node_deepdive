const fs = require('fs');
const Tour = require('../models/tourModel');

// USE OF JSON.PARSE

// JSON.parse means the json from the file will automatically be converted into a javascript object
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


// USE OF MIDDLEWARE (i don't need a checkId function because mongodb automatically asigns an id)

// this middleware function is following best express practice.
// creating an error handling function and storing it in a variable and then adding this to each function
// would not be following the middleware pipeline convention
// const checkId = (req, res, next, value) => {
//     console.log(`tour id is: ${value}`)
//     // * 1 will convert a string into an integer
//     if (req.params.id * 1 > tours.length) {
//         // without the return node would continue running the code and hit the next function
//         return res.status(404).json({
//             status: 'fail',
//             message: 'invalid id'
//         });
//     }
//     next();
// };

// I don't need this middleware function because the body of the data is checked in the schema
// this great middleware function checks the body of the request for certain things before next()
// the point of middleware functions is to remove all aspects of the main functions leaving only the core
// const checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         // 400 is bad request
//         return res.status(400).json({
//             status: 'fail',
//             message: 'invalid name and/or price'
//         });
//     }
//     next();
// };


const getAllTours = async (req, res) => {
    console.log(req.requestTime);

    try {
        // await until all the tours are found and then return them
        // the find method returns an array containing javascript objects
        const allTours = await Tour.find();

        res.status(200).json({
            status: 'success',
            results: allTours.length,
            data: {
                allTours
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'unable to get tours data'
        });
    }

    // .json is a send method that send a json object
    // res.status(200).json({
    //     the status of the get request
    //     status: 'success',
    //     requestedAt: req.requestTime,
    //     providing the length of the tours makes it easy for a programmer to see the quantity
    //     results: tours.length,
    //     data: is an envelope that contains the actual data response object
    //     data: {
    //         key/url endpoint and value/tours variable
    //         tours: tours
    //     }
    // });
};

const getTourById = async (req, res) => {
    try {
        // req = is the url request. params = the variables within the url. id = the param that is being latched onto
        const tourById = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour: tourById
            }
        }); 
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'unable to get tour'
        });
    }
    
    // the params refer to the variables stored un the url :id
    // /api/v1/tours/5 will automatically asign the :id variable to 5
    // console.log(req.params);

    // req.params.id returns a string with the id number inside
    // by multiplying the string by one, it will convert the string to an integer
    // const id = req.params.id * 1;

    // .find creates a new array with the tour that matches the tour in the params
    // const tour = tours.find(element => element.id === id);

    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour: tour
    //     }
    // });
};

const createTour = async (req, res) => {
    // try catch block essential for async/await
    try {
        // saving the result value of the promise in a variable. req.body is the data that comes with the post
        // Tour.create returns a promise. when this is resolved then it is stored in the variable
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
            // the promise has been resolved and the post data is ready to be sent to mongo
            tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'failure',
            message: 'incomplete tour data'
        });   
    }

    // the request object refers to the data that is being posted
    // body refers to the object data that is attached to the request
    // console.log(req.body);

    // because there is no database and the data is coming from a regular .js file
    // use the [tours.length - 1] to find the last posted tour object
    // the .id accesses the id of the last tour object
    // the + 1 generates a 
    // const newId = tours[tours.length - 1].id + 1

    // object.assign allows for creation of a new object by merging two existing objects together
    // the new object tour has been created and stored in newTour
    // const newTour = Object.assign({ id: newId }, req.body);

    // the tours array now has the new tour pushed in with its id
    // tours.push(newTour);

    // writeFileSync would block the event loop!
    // fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    //     status 201 means created
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     });
    // });
};

const updateTour = async (req, res) => {
    try {
        // the req.body refers to what will be updated
        const update = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            // this ensures that the new updated document is the one that will be returned
            new: true
        });
        
        res.status(200).json({
            status: 'success',
            message: 'tour updated',
            data: {
                tour: update
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'failure',
            message: 'tour update failed'
        });
    }
};

const deleteTour = (req, res) => {
    // 204 means 'no content'
    res.status(204).json({
        status: 'success',
        // null proves the data i deleted no longer exists
        data: null
    });
};

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour
};