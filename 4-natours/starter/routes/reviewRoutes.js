const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const routes = express.Router();

routes
    .route('/')
    .get(reviewController.getAllReviews)
    .post(authController.protect, authController.restrictTo('user'), reviewController.createReview)

module.exports = routes;