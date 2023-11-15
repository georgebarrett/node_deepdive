const mongoose = require('mongoose');

// outlining the schema and storing it in a variable
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        // the error handling is in the string. square braces essential
        required: [true, 'a tour must have a name'],
        // true ensures that no two documents can have the same name
        unique: true,
        // trim removes the white spaces in the string
        trim: true
    },
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
        required: [true, 'a tour must have a difficulty rating']
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
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
        default: Date.now()
    },
    // this will save the dates in an array of strings
    startDates: [Date]
});

// by convention models should start with a capital
// models take the data schema and allow for crud operations
// 'tours' makes a collection called tours within the tours_database
const Tour = mongoose.model('tours', tourSchema);

module.exports = Tour;