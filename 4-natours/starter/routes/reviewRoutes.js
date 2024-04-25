const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const crudFactory = require('../controllers/crudFactory');

const routes = express.Router({ mergeParams: true });

// mergeParams 
// POST /tour/dh4756heu848/reviews
// POST /tour/reviews
// both of these routes will be re-routed to the router below using mergeParams
// routes.use('/:tourId/reviews', reviewRouter); - this line is logic behing the re-routing and is in tourRoutes.js

routes
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect, 
        authController.restrictTo('user'), 
        reviewController.setUserAndTourIds, 
        reviewController.createReview
    );

routes
    .route('/:id')
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);
    // .delete(authController.protect, authController.restrictTo('admin'), crudFactory.deleteOne);

module.exports = routes;