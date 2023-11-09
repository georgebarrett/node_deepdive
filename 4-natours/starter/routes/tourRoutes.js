const express = require('express');
const toursController = require('../controllers/toursController');

const routes = express();

// the value holds the id parameter
// this middleware function only applies to the tours 
// this essentially just checks the url for invalid ids and then fires an error handling function
routes.param('id', toursController.checkId);

routes
    .route('/')
    .get(toursController.getAllTours)
    .post(toursController.createTour)

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTour)
    .delete(toursController.deleteTour)

module.exports = routes;