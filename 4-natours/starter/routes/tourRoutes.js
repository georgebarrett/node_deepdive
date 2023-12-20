const express = require('express');
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');

const routes = express();

routes
    .route('/top-5-cheapest')
    // chaining middleware pipelines. the middleware function acts as an aggregate pipeline
    .get(toursController.aliasTopFiveCheapestTours, toursController.getAllTours)

routes
    .route('/tour-stats')
    .get(toursController.getTourStats)

routes
    .route('/monthly-plan/:year')
    .get(toursController.getMonthlyPlan)

routes
    .route('/')
    .get(authController.protect, toursController.getAllTours)
    .post(toursController.createTour)

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTour)
    .delete(authController.protect, toursController.deleteTour)

module.exports = routes;