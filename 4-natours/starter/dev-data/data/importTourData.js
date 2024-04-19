const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

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

// READING JSON FILE

// the JSON.parse converts the json data into a javascript object
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// FUNCTION TO IMPORT DATA FROM JSON FILE TO DATABASE

const importToursData = async () => {
    try {
        await Tour.create(tours);
        console.log('data imported to database');
    } catch (error) {
        console.log(error);
    }
    // this is an aggressive way of exiting a the process of deleting all the data
    process.exit();
};

// DELETE ALL DATA FROM DATABASE

const deleteAllData = async () => {
    try {
        // with deleteMany nothing needs to be passed in because it will delete all
        // Tour is mongoose model which provides methods to interact with the mongodb database
        await Tour.deleteMany();
        console.log('all data has been deleted');
    } catch (error) {
        console.log(error)
    }
    process.exit(); 
};

// argv allows for firing functions in the terminal
// node importTourData.js --import  ----  this will execute the importToursData() function via the terminal
// same applied for the --delete
if (process.argv[2] === '--import') {
    importToursData();
} else if (process.argv[2] === '--delete') {
    deleteAllData();    
}