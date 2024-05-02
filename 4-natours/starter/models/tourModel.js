const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');
// const validator = require('validator');

// outlining the schema and storing it in a variable
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        // the error handling is in the string. square braces essential
        required: [true, 'a tour must have a name'],
        // true ensures that no two documents can have the same name
        unique: true,
        // trim removes the white spaces in the string
        trim: true,
        maxLength: [40, 'a tour name must have 40 or less characters'],
        minLength: [2, 'a tour name must have at least 2 characters'],
    },
    slug: String,
    rating: {
        type: Number,
        // default means that if no rating is left by the user, 4.5 will automatically be assigned
        default: 4.5
    },
    duration: {
        type: Number,
        required: [true, 'a tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'a tour must have a maximum group size']
    },
    difficulty: {
        type: String,
        required: [true, 'a tour must have a difficulty rating'],
        // enum stipulates valid values
        enum: {
            values: ['easy', 'medium', 'difficult'],
            validationMessage: 'tour difficulty must be easy, medium or difficult'
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'the lowest tour rating is 1'],
        max: [5, 'the highest tour rating is 5'],
        // set is a function that is run each time a value is set for this field
        set: value => Math.round(value * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            // the value will only be accepted if it lower than the original price
            // 'this' refers to the schema object
            // the validator function will only work when creating a document/tour
            validator: function(value) {
                return value < this.price;    
            },
            // ({VALUE}) is a mongoose trick that will display the value. similar to a template literal
            message: 'The discounted price ({VALUE}) must be lower than the original price'
        },    
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'a tour summary must be provided']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        // this will be the name of the image
        type: String,
        required: [true, 'a tour must have a cover image']
    },
    // this will save the names of the images in an array of strings
    images: [String],
    createdAt: {
        // creates a timestamp
        type: Date,
        default: Date.now(),
        // this will remove the field from the database
        // select: false
    },
    // this will save the dates in an array of strings
    startDates: [Date],
    secretTour: {
        // usually the tours are not secret hence the 'false'
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    // specifying an array will create embedded documents
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    // EMBEDDED
    // guides: Array
    // REFERENCING
    guides: [
        {
            // plucks the id from the user model
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
    }, 
    {
        // these schema options ensure that virtual properties are included
        // data is either in json or javascript-object form
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// price is the index. 1 means iterating in an ascending order. -1 the opposite
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

// this is busines logic that is not actually part of the database
// it has nothing to do with requests and responses
// virtuals allow the user to create fields derived from other fields
tourSchema
    .virtual('durationInWeeks')
    // this is not an arrow function because i need the 'this'. Mongoose convention
    // getter function that returns the value of the virtual property
    .get(function() {
        // the duration field is in days, therefore dividing it by 7 will give a weekly value
        // 'this' points to the current virtual property
        return this.duration / 7
    });

tourSchema.virtual('reviews', {
    // connecting the tour and review model together via ids
    // referencing review schema
    ref: 'Review',
    // the targeting field of the review schema. the tour field contains the id of the tour
    foreignField: 'tour',
    // stating the field name where the tour id is stored in this current schema (auto generated by mongo)
    localField: '_id'
});

// DOCUMENT MIDDLEWARE: only runs on .create and .save
// this middleware function gives access to the document being processed (created and saved)
tourSchema.pre('save', function(next) {
    // when a document is saved a slug field is generated
    this.slug = slugify(this.name, { lower: true });
    next();
});

// EMBEDDING
// tourSchema.pre('save', async function(next) {
//     // this.guides is an array of all the User ids
//     // the map function will return promises due to the asynchronous nature
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     // overrides array of user ids with an array of user documents
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// QUERY MIDDLEWARE
// the 'find' makes this query middleware
// the middleware will point at the query not the document
// the middleware will be executed 'pre' the query and not include '$ne' any secret tours
// the regex method will mean that any find query will pass through this middleware
tourSchema.pre(/^find/, function(next) {
    // 'this' refers to the query object. 'find' secret tours and exclude them
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now()
    next();
});

tourSchema.pre(/^find/, function(next) {
    // this.. always points to the current query
    // all the 'guides' fields will be populated by the referenced user
    this.populate({
        path: 'guides',
        // excluded from population process
        select: '-__v -passwordChangedAt'
    })
    next();
});

// this post middleware function displays the document post time in milliseconds
tourSchema.post(/^find/, function(documents, next) {
    // this.start is essentially a timer that was started in the previous middleware function
    console.log(`query took ${Date.now() - this.start} milliseconds`)
    next();
});


// AGGREGATION MIDDLEWARE
// using pre because i want the middleware to fire before the aggregation pipeline takes place
tourSchema.pre('aggregate', function(next) {
    // before any pipeline takes place, the secretTour key and value will be pushed into the array
    // which will remove any secret tours
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    // 'this.pipeline' points to the aggregation pipeline object (array)
    console.log(this.pipeline());
    next();
});

// by convention models should start with a capital
// models take the data schema and allow for method operations
// 'tours' makes a collection called tours within the tours_database
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;


// USEFUL REFERENCES 

// POST HOOK/MIDDLEWARE

// post means the hook/middleware is executed after the event has occured
// tourSchema.post('save', function(document, next) {
//     console.log(document);
//     next();
// });