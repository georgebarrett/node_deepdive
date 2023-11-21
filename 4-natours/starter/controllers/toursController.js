const fs = require('fs');
const Tour = require('../models/tourModel');

aliasTopFiveCheapestTours = (req, res, next) => {
    // this is a url query in middleware format that prefills parts of the query object
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price',
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

class APIFeatures {
    // this function gets automatically called when a new object is created
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // {...} = js spread operator. creating a new object from the properties of req.query
        // queryObject has the same properties as this.query
        // spread operators are used to modify an object but preserve the original. this allows for experiments
        const queryObject = {...this.queryString};
        // these are url params that I want to exclude from this.queryString
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // this is the process for excluding the params
        excludedFields.forEach(element => delete queryObject[element]);

        // 2. ADVANCED FILTERING

        // this variable can be redfined - JSON.stringify converts the queryObject to a JSON string
        let queryString = JSON.stringify(queryObject);
        // queryString is redifined - the replace functions adds a $ to the maths queries
        // the 'g' ensures the $ is added to all the occurrences. not just the first occurence 
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        // JSON.parse coverts the json string back into a javascript object
        this.query = this.query.find(JSON.parse(queryString));
        // 'this' refers to the entire object
        return this;
    }

    sort() {
        // the if statement checks to see if sort is included in the url
        if (this.queryString.sort) {
            // this creates a new sorting method where multiple sorting fields can be chained together
            const sortBy = this.queryString.sort.split(',').join(' ');
            // this modifies the existing query pattern to include a sorting method
            this.query = this.query.sort(sortBy);
        } else {
            // creating a default sorting method (descending order)
            this.query = this.query.sort('-createdAt');
        }
        // 'this' refers to the entire object
        return this;
    }

    limitFields() {
        // the if checks to see if there are fields in the url eg ?fields=name,description
        if (this.queryString.fields) {
            // this converts the firelds sinto an array of strings and then into a string with space separations
            // mongoose likes this format
            const fields = this.queryString.fields.split(',').join(' ');
            // this modifies the existing mongoose query so that it only includes the fields that are defined
            this.query = this.query.select(fields);
        } else {
            // by default i am only excluding the __v field (this is a special field for mongoose) -means exclude
            this.query = this.query.select('-__v')
        }
        return this;
    }

    paginate() {
        // * 1 this will convert the string into an integer. queries are by default strings
        // the || 1 means the page number will default to 1  
        const page = this.queryString.page * 1 || 1;
        // * 1 converts the limit to an integer || sets default result limit to 100 
        const limit = this.queryString.limit * 1 || 100;
        // page - 1 is the previous page. multiplying the previous page by the result limit gives the total number of items to skip
        // if page is 3 and limit is 10 (3 - 1) * 10 = 20 so the query should skip the first 20 items  
        const skip = (page - 1) * limit;

        // limit is the amount of results that we want 
        // skip is the amount of results that should be skipped before the data gets queried
        // page=3&limit=10, 1-10 - page 1, 11-20 - page-2, 21-30 - page-3
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

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
            message: error.message
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
            message: 'incomplete tour data'
        });   
    }
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
};

module.exports = {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
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