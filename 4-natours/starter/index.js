const express = require('express');
const morgan = require('morgan');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();


// MIDDLEWARE

// when a request is made, morgan shows some useful stuff in the console
app.use(morgan('dev'));

// express.json is middleware so that data from the client side can be attached to request objects
app.use(express.json());

// by passing next, express knows i am defining a middle ware function
// middleware functions must be above any http response or they won't be included in the cycle
app.use((req, res, next) => {
    console.log('middleware');
    // always use next in middleware functions otherwise the request response cycle would get stuck
    next();
});

app.use((req, res, next) => {
    // this is attaching a date to the request. .toISOString converts the date into a nice string
    req.requestTime = new Date().toISOString();
    next();
});

// adding v1 is a form of version control
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);


module.exports = app;