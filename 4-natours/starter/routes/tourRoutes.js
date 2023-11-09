const express = require('express');
const toursController = require('../controllers/toursController');

const routes = express();

// the value holds the id parameter
// this middleware function only applies to the tours 
routes.param('id', (req, res, next, value) => {
    console.log(`tour id is: ${value}`);
    next();
});

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