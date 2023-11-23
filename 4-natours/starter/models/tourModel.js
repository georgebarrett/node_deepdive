const mongoose = require('mongoose');
const slugify = require('slugify');

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
        maxLength: [40, 'A tour name must have 40 or less characters'],
        minLength: [2, 'A tour name must have at least 2 character']
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
        max: [5, 'the highest tour rating is 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price']
    },
    discount: Number,
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
    }
    }, 
    {
        // these schema options ensure that virtual properties are included
        // data is either in json or javascript-object form
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// this is busines logic that is not actually part of the database
// it has nothing to do with requests and responses
// virtuals allow the user to create fields derived from other fields
tourSchema
    .virtual('durationInWeeks')
    // this is not an arrow function because i need the 'this'. Mongoose convention
    // getter function that returns the value of the virtual property
    .get(function() {
        // the duration field is in days, therefore dividing it by 7 will give a weekly value
        // 'this points to the current virtual property'
        return this.duration / 7
    });

// DOCUMENT MIDDLEWARE
// this middleware function gives access to the document being processed (created and saved)
tourSchema.pre('save', function(next) {
    // when a document is saved a slug field is generated
    this.slug = slugify(this.name, { lower: true });
    next();
});

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
const Tour = mongoose.model('tours', tourSchema);

module.exports = Tour;


// USEFUL REFERENCES 

// POST HOOK/MIDDLEWARE

// post means the hook/middleware is executed after the event has occured
// tourSchema.post('save', function(document, next) {
//     console.log(document);
//     next();
// });

