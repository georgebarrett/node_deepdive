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
        // 1. FILTERING 

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

        // 2. ADVANCED FILTERING

        // this variable can be redfined - JSON.stringify converts the queryObject to a JSON string
        let queryString = JSON.stringify(queryObject);
        // queryString is redifined - the replace functions adds a $ to the maths quieries
        // the 'g' ensures the $ is added to all the occurrences. not just the first occurence 
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // JSON.parse coverts the json string back into a javascript object
        // console.log(JSON.parse(queryString));
        
        // this is using the model method to find the documents that match the argument criteria
        let query = Tour.find(JSON.parse(queryString));

        // 3. SORTING

        // the if statement checks to see if sort is included in the url
        if (req.query.sort) {
            // this creates a new sorting method where multiple sorting fields can be chained together
            const sortBy = req.query.sort.split(',').join(' ');
            // this modifies the existing query pattern to include a sorting method
            query = query.sort(sortBy);
        } else {
            // this is for if a user does not specify a sort field
            // creating a default sorting method (descending order)
            query = query.sort('-createdAt');
        }

        // FIELD LIMITING
        
        // the if checks to see if there are fields in the url eg ?fields=name,description
        if (req.query.fields) {
            // this converts the firelds sinto an array of strings and then into a string with space separations
            // mongoose likes this format
            const fields = req.query.fields.split(',').join(' ');
            // this modifies the existing mongoose query so that it only includes the fields that are defined
            query = query.select(fields);
        } else {
            // by default i am only excluding the __v field (this is a special field for mongoose)
            // the - means exclude
            query = query.select('-__v')
        }

        // PAGINAION

        // * 1 this will convert the string into an integer. queries are by default strings
        // the || 1 means the page number will default to 1  
        const page = req.query.page * 1 || 1;
        // * 1 converts the limit to an integer || sets default result limit to 100 
        const limit = req.query.limit * 1 || 100;
        // page - 1 is the previous page. multiplying the previous page by the result limit gives the total number of items to skip
        // if page is 3 and limit is 10 (3 - 1) * 10 = 20 so the query should skip the first 20 items  
        const skip = (page - 1) * limit;

        // limit is the amount of results that we want 
        // skip is the amount of results that should be skipped before the data gets queried
        // page=3&limit=10, 1-10 - page 1, 11-20 - page-2, 21-30 - page-3
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            // the countDocuments() method does exactly that. it is an inbuilt mongoose model method
            // once the ducments have been counted in full then the quantity is stored in the variable
            const numberOfTours = await Tour.countDocuments();
            if (skip >= numberOfTours) throw new Error('this page does not exist');
        }

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
            message: error.message
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