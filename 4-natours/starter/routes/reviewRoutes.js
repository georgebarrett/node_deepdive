const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const routes = express();

routes
    .get(reviewController.getAllReviews)

routes
    .post(reviewController.createReview)

module.exports = routes;