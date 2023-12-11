const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();


// MIDDLEWARE

// morgan is in this if statement so it will only be activated when the 'development' envirnoment is activated
// this is due to morgan being able to display sensitive information.
// this console log will tell me which environment i am in in throught the terminal
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    // when a request is made, morgan shows some useful stuff in the console
    app.use(morgan('dev')); 
};

// express.json is middleware so that data from the client side can be attached to request objects
app.use(express.json());

// this is for being able to access static files
// it also sets the public folder to the route
app.use(express.static(`${__dirname}/public`));

// always pass next into middleware functions otherwise the code gets stuck
app.use((req, res, next) => {
    // this is attaching a date to the request. .toISOString converts the date into a nice string
    req.requestTime = new Date().toISOString();
    next();
});

// adding v1 is a form of version control
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {

    next(new AppError(`cannot find ${req.originalUrl} on this server...`, 404));

    next(error);
});

app.use(globalErrorHandler);

module.exports = app;