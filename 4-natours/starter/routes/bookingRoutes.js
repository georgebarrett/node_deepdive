const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const routes = express.Router();

routes.use(authController.protect);

routes.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

routes.use(authController.restrictTo('admin', 'lead-guide'));

routes.route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking)

routes.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking)

module.exports = routes;
