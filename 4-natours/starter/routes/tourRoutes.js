const express = require('express');
const toursController = require('../controllers/toursController');
const authController = require('../controllers/authController');
const reviewRouter = require('../routes/reviewRoutes');

const routes = express();

// for the path bellow i want to use the review router. mounting routers
// index.js will send the tour here. here will re route the tour to the review router
// consequently the tour router and review router are seperated and WET
routes.use('/:tourId/reviews', reviewRouter);

routes
    .route('/top-5-cheapest')
    // chaining middleware pipelines. the middleware function acts as an aggregate pipeline
    .get(toursController.aliasTopFiveCheapestTours, toursController.getAllTours);

routes
    .route('/tour-stats')
    .get(toursController.getTourStats);

routes
    .route('/monthly-plan/:year')
    .get(toursController.getMonthlyPlan);

routes
    .route('/')
    .get(toursController.getAllTours)
    .post(toursController.createTour);

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(toursController.getTourById)
    .patch(toursController.updateTour)
    .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), toursController.deleteTour);

// removed due to express's ability to mergeParams
    // routes
//     .route('/:tourId/reviews')
//     .post(authController.protect, authController.restrictTo('user'), reviewController.createReview);

module.exports = routes;