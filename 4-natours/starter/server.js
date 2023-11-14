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