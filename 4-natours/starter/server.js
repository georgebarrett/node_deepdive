const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./index');

// this is accessing code from the .env vile
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// this function connects to my mongodb database using mongoose
const connectdb = async () => {
    try {
        await mongoose.connect(db);
        console.log('connected to database');
    } catch (error) {
        console.error('database connection failed', error);
    }
};
connectdb();

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



// FUNCTIONS TO TEST SENDING DATA TO THE DATABASE


// this function creates a new instance of the Tour model and then provides an example schema
// const testTour = new Tour({
//     name: 'Tour of Pluto',
//     rating: 4.9,
//     price: 100
// });

// this will save the testTour object to the mongo collection
// const saveTestTour = async () => {
//     try {
//         const document = await testTour.save();
//         console.log(document);    
//     } catch (error) {
//         console.log('error', error);
//     }
// };
// saveTestTour();

// console.log(process.env);



// STARTING SERVER


// if the 'development' envrionment is activated then the project will work in PORT (defined in .env)
// if not then the project will run on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`${port}...`);
});