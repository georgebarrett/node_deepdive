const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsyncErrors = require('../utils/catchAsyncError');
const factory = require('./crudFactory');

const aliasTopFiveCheapestTours = (req, res, next) => {
    // this is a url query in middleware format that prefills parts of the query object
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price',
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

const getAllTours = factory.getAll(Tour);

const getTourById = factory.getOne(Tour, { path: 'reviews' });

const createTour = factory.createOne(Tour);

const updateTour = factory.updateOne(Tour);

const deleteTour = factory.deleteOne(Tour);

const getTourStats = catchAsyncErrors(async (req, res, next) => {
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
});

const getMonthlyPlan = catchAsyncErrors(async (req, res, next) => {
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
});

const getToursWithin = catchAsyncErrors(async (req, res, next) => {
    // all the info comes from the URL paramters and is stored. the info his been destructured hence the {}
    const { distance, latlng, unit } = req.params;
    // the latlng param is changed from a string into an array or strings divided by a comma with the .split
    // the two elements are then stored individually in a variable
    const [lat, lng] = latlng.split(',');

    // this variable stores radians. a radian is a unit that divides the distance variable by the radius of the earth
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    
    if (!lat || !lng) {
        next(new AppError('please provide the latitude and longitude in lat,lng format', 400));
    }
    console.log(distance, lat, lng, unit)

    // centerSphere takes an array of the coordinates and the radius
    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours
        }
    });
});

const getDistances = catchAsyncErrors(async (req, res, next) => {
    const {latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
        next(new AppError('please provide the latitude and longitude in lat, lng format', 400));
    }

    const distances = Tour.aggregate([
        {
            $geoNear: {
                // the geographic point that is passed into the function
                near: {
                    type: 'Point',
                    // using * 1 for integer conversion
                    coordinates: [lng * 1, lat * 1]
                },
                // this field will be created and display all the aggregation calculations that have been made
                distanceField: 'distance'
            }
        }
    ]);

    res.stats(200).json({
        status: 'success',
        data: {
            data: distances
        }
    });
});

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    getTourStats,
    getMonthlyPlan,
    getToursWithin,
    getDistances,
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