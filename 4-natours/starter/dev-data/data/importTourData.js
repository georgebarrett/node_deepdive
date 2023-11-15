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
const tours = JSON.parse(fs.readFileSync('tours-simple.json', 'utf-8'));

// FUNCTION TO IMPORT DATA FROM JSON FILE TO DATABASE

const importToursData = async () => {
    try {
        await Tour.create(tours);
        console.log('data imported to database');
    } catch (error) {
        console.log(error);
    }
};