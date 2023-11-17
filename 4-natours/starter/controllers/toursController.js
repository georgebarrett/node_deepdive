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

        // BUILDING QUERY
        // 1. filtering

        // {...req.query} = js spread operator. creating a new object from the properties of req.query
        // queryObject has the same properties as req.query
        // spread operators are used to modify an object but preserve the original. this allows for experiments
        const queryObject = {...req.query};
        // these are url params that I want to exclude from the request
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // this is the process for excluding the params
        excludedFields.forEach(element => delete queryObject[element]);
        // this logs my url query to the console
        console.log(req.query, queryObject);

        // variable that stores - Tour model with the find method. queryObject is passed in which is the copy
        // of the req.query object { difficulty: 'easy' } 
        // const query = Tour.find(queryObject);

        // 2. advanced filtering

        // this variable can be redfined - JSON.stringify converts the queryObject to a JSON string
        let queryString = JSON.stringify(queryObject);
        // queryString is redifined - the replace functions adds a $ to the maths quieries
        // the 'g' ensures the $ is added to all the occurrences. not just the first occurence 
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // JSON.parse coverts the json string back into a javascript object
        console.log(JSON.parse(queryString));
        // this is using the model method to find the documents that match the argument criteria
        const query = Tour.find(JSON.parse(queryString));

        // EXECUTING QUERY

        // this executes the query but waits for the promise to be resolved
        const tours = await query;

        // SEND RESPONSE

        // .json converts a javascript object into a json strong and sends it
        res.status(200).json({
            status: 'success',
            requestedAt: req.requestTime,
            results: tours.length,
            // data is the envelope for the response
            data: {
                // url endpoint: tours data
                tours: tours
            }
        });

        // ALTERNATIVE METHOD

        // await until all the tours are found and then return them
        // the find method returns an array containing javascript objects
        // const allTours = await Tour.find();
        
        // this uses the find method to filter through the tours
        // const allTours = await Tour.find({
        //     duration: 5,
        //     difficulty: 'easy'
        // });

        // res.status(200).json({
        //     status: 'success',
        //     results: allTours.length,
        //     data: {
        //         tours: allTours
        //     }
        // });
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'unable to get tours data'
        });
    }
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

    // ALTERNATIVE METHOD

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

const deleteTour = async (req, res) => {
    try {
        const remove = await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'tour deleted',
            data: {
                tour: remove
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'tour not deleted'
        });
    }
    
    // 204 means 'no content'
    // res.status(204).json({
    //     status: 'success',
    //     null proves the data i deleted no longer exists
    //     data: null
    // });
};

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour
};