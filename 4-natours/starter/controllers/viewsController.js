const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsyncError');

const getOverview = catchAsync(async (req, res, next) => {
    // fetching all the tour data from the database
    const tours = await Tour.find();
    
    // all the tour data is passed into the response object
    res.status(200).render('overview', {
        title: 'All Tours',
        tours: tours
    });
});

const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    });

    if (!tour) {
        return next(new AppError('There is no tour with that name.', 404));
    }
    
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour: tour
    });
});

const getLoginForm = (req, res) => {
    res.status(200).set('Content-Security-Policy', "connect-src 'self' https://cdnjs.cloudflare.com").render('login', {
        title: 'Log in',
    });
};

const getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Your account'
    });
};

const getMyTours = catchAsync(async (req, res, next) => {
    // find all bookings associated with a user
    const bookings = await Booking.find({ user: req.user.id });

    // loops through bookings array and for each element it will grab the tour ids 
    const tourIds = bookings.map(element => element.tour);
    // finds the ids of the tours that are in the tourIds array
    const tours = await Tour.find({ _id: { $in: tourIds } });
    // now they can be rendered
    res.status(200).render('overview', {
        title: 'My tours',
        tours: tours
    });
});

const updateUserData = catchAsync(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
            name: req.body.name,
            email: req.body.email
        },
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).render('account', {
        title: 'Your account',
        user: updatedUser
    });
});

module.exports = {
    getOverview,
    getTour,
    getLoginForm,
    getAccount,
    getMyTours,
    updateUserData
}