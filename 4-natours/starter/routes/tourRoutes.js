const express = require('express');
const toursController = require('../controllers/toursController');

const routes = express();

routes
    .route('/')
    .get(toursController.getAllTours)
    .post(toursController.createTour)

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(toursController.getTourById)
    .post(toursController.createTour)
    .patch(toursController.updateTour)
    .delete(toursController.deleteTour)

module.exports = routes;