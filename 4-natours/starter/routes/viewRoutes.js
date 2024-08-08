const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const routes = express.Router();

// home page is hit, a new booking is created, the user is then redirected to the home page but without the sensitive url params
// then the user passes through the isLoggedIn middleware and reaches the getOverview function
routes.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);
routes.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
routes.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
routes.get('/me', authController.protect, viewsController.getAccount);
routes.get('/my-tours', authController.protect, viewsController.getMyTours);

routes.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = routes;