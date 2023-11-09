const express = require('express');
const { getAllTours, createTour, getTourById, updateTour, deleteTour } = require('../controllers/toursController');

const routes = express();

routes
    .route('/')
    .get(getAllTours)
    .post(createTour)

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(getTourById)
    .post(createTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = routes;