const mongoose = require('mongoose');

// outlining the schema and storing it in a variable
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        // the error handling is in the string. square braces essential
        required: [true, 'a tour must have a name'],
        // true ensures that no two documents can have the same name
        unique: true
    },
    rating: {
        type: Number,
        // default means that if no rating is left by the user, 4.5 will automatically be assigned
        default: 4.5

    },
    price: {
        type: Number,
        required: [true, 'a tour must have a price']
    }
});

// by convention models should start with a capital
// models take the data schema and allow for crud operations
// 'tours' makes a collection called tours within the tours_database
const Tour = mongoose.model('tours', tourSchema);

module.exports = Tour;