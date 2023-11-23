const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const aliasTopFiveCheapestTours = (req, res, next) => {
    // this is a url query in middleware format that prefills parts of the query object
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price',
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

const getAllTours = async (req, res) => {
    console.log(req.requestTime);

    try {
        // creating a new instance of the APIFeatures object and storing it into a variable
        // Tour.find() is passing a query object
        // req.query is the string that is coming from express
        // the four methods are defined in the APIFeatures class and must include a return statement
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
        // await the query result so that all the selected documents can be retrieved
        // query now lives in 'features' which is the new object stored in a variable
        const tours = await features.query;

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
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'cannot retrieve tour data'
        });
    }
   
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
            message: error
        });   
    }
};

const updateTour = async (req, res) => {
    try {
        // the req.body refers to what will be updated
        const update = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            // this ensures that the new updated document is the one that will be returned
            new: true,
            // ensures the updateTour function passes throught the middleware functions in the model
            runValidators: true
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
            message: error
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
};

const getTourStats = async (req, res) => {
    try {
        // using the Tour model to access the tour collection
        // the array contains stages. one follows the other
        const stats = await Tour.aggregate([
            {
                // match is where documents get plucked if they meet the criteria
                $match: { ratingsAverage: { $gte: 4.5 } } 
            },
            {
                // group is where i can apply maths to the matches
                $group: {
                    // always specify the id for grouping purposes
                    // i am assigning the difficulty field to the id field, this is dynamic
                    _id: { $toUpper: '$difficulty' },
                    // $sum: 1 means add one for each document (increment)
                    numberOfTours: { $sum: 1 },
                    numberOfRatings: { $sum: '$ratingsQuantity' },
                    averageRating: { $avg: '$ratingsAverage' },
                    averagePrice: { $avg: '$price' },
                    minimumPrice: { $min: '$price' },
                    maximumPrice: { $max: '$price' }
                }
            },
            {
                // the sorting field names must match the grouping keys
                // this is sorting by the average rating field. -1 for descending
                $sort: { averageRating: -1 }
            },
            {
                // not equal to easy. this is chaining stages
                $match: { _id: { $ne: 'EASY' } }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats: stats
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'stats not retrieved'
        });
    }
};

const getMonthlyPlan = async (req, res) => {
    try {
        // req = request. params = url. year = variable parameter. * 1 to create an integer
        const year = req.params.year * 1;
        
        const plan = await Tour.aggregate([
            {
                // unwind deconstructs an array field and makes a document for each element
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        // new Date is used to create a date object from the string
                        // a javascript date object is needed by mongoDB
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numberOfToursStartingInMonth: { $sum: 1 },
                    // $push creates an array
                    // name refers to the name of the tour not the field
                    toursInformation: { $push: '$name' }
                }
            },
            {
                // adds a new field to each document. '$_id' holds the month number eg 8 for august
                $addFields: { month: '$_id' }
            },
            {
                // excludes the id field from the document 
                $project: {
                    _id: 0
                }
            },
            {
                // the month with the most tours will be at the top
                $sort: { numberOfToursStartingInMonth: -1 }
            },
            {
                // limiting results to 12
                $limit: 12
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan: plan
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: 'monthly plan failed'
        });
    }
};

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan,
    aliasTopFiveCheapestTours
};


// WRITING TO FILES

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


// USE OF JSON.PARSE

// JSON.parse means the json from the file will automatically be converted into a javascript object
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );


// USEFUL CODE

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