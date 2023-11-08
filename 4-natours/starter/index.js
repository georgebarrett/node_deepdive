const fs = require('fs');
const express = require('express');
const { request } = require('http');
const tourController = require('./controllers');

const app = express();

// express.json is middleware so that data from the client side can be attached to request objects
app.use(express.json());

// by adding v1, i can work on v2 without messing with the original request setup
app.get('/api/v1/tours', tourController.getAllTours);

// the : creates a variable called id
app.get('/api/v1/tours/:id', tourController.getTourById);

app.post('/api/v1/tours', tourController.createTour);

app.patch('/api/v1/tours/:id', tourController.updateTour);

app.delete('/api/v1/tours/:id', tourController.deleteTour);

const port = 3000;
app.listen(port, () => {
    console.log(`${port}...`)
});