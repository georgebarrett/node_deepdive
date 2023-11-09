const fs = require('fs');
const express = require('express');
const { request } = require('http');
const morgan = require('morgan');
const toursController = require('./controllers/toursController');
const usersController = require('./controllers/usersController');

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


// TOURS ROUTES

// by adding v1, i can work on v2 without messing with the original request setup
app.get('/api/v1/tours', toursController.getAllTours);

// the : creates a variable called id
app.get('/api/v1/tours/:id', toursController.getTourById);

app.post('/api/v1/tours', toursController.createTour);

app.patch('/api/v1/tours/:id', toursController.updateTour);

app.delete('/api/v1/tours/:id', toursController.deleteTour);


// USERS ROUTES

app.get('/api/v1/users', toursController.getAllTours);

app.get('/api/v1/users/:id', usersController.getAllUsers);

app.post('/api/v1/users', usersController.getUserById);

app.patch('/api/v1/users/:id', usersController.updateUser);

app.delete('/api/v1/users/:id', usersController.deleteUser);


// STARTING SERVER

const port = 3000;
app.listen(port, () => {
    console.log(`${port}...`)
});