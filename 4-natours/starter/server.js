const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./index');

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const connectdb = async () => {
    try {
        await mongoose.connect(db);
        console.log('connected to database');
    } catch (error) {
        console.error('database connection failed', error);
    }
};

connectdb();

// console.log(process.env);

// STARTING SERVER
// if the 'development' envrionment is activated then the project will work in PORT (defined in .env)
// if not then the project will run on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`${port}...`);
});