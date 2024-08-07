const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsyncErrors = require('../utils/catchAsyncError');
const factory = require('./crudFactory');

const getCheckoutSession = catchAsyncErrors(async (req, res, next) => {
    // get current booked tour
    const tour = await Tour.findById(req.params.tourId);

    // create checkout session
    // session info
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        // product info
        line_items: [
            {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [`http://localhost:3000/img/tours/${tour.imageCover}`]
                    },
                    unit_amount: tour.price * 100
                },
                quantity: 1
            },
        ],
    });

    // create session response
    res.status(200).json({
        status: 'success',
        session: session
    });
});

const createBookingCheckout = catchAsyncErrors(async (req, res, next) => {
    // UNSECURE - anyoe can make bookings without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    await Booking.create({ tour, user, price });
    // response to redirect to the home route but without sensitive information in the URL
    res.redirect(req.originalUrl.split('?')[0]);
});

module.exports = {
    getCheckoutSession,
    createBookingCheckout
}