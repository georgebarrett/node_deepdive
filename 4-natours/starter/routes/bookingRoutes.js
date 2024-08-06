const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');
const crudFactory = require('../controllers/crudFactory');

const routes = express.Router();

routes.get('/checkout-session/:tourId', authController.protect, bookingController.getCheckoutSession)

module.exports = routes;
