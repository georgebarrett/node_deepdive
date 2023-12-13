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


// STARTING SERVER

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`${port}...`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('unhandled rejection. shutting down...');
    server.close(() => {
        process.exit(1);
    }); 
});

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