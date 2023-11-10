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
    // chaining middleware pipelines. the checkBody middleware function has to fully execute before
    // the createTour function fires
    .post(toursController.checkBody, toursController.createTour)

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTour)
    .delete(toursController.deleteTour)

module.exports = routes;