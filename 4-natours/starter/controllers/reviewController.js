const Review = require('../models/reviewModel');
const catchAsyncErrors = require('../utils/catchAsyncError');

const getAllReviews = catchAsyncErrors(async (req, res, next) => {
    let filter = {};
    // if there is a tur id then filter will be equal to the object
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // .find will return all the reviews unless a tour id has been passed in. then it will just return the reviews for that tour
    const reviews = await Review.find(filter);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            review: reviews
        }
    });
});

const createReview = catchAsyncErrors(async (req, res, next) => {
    // these ifs define the tour and user if they are not present in the request body
    // if the tour id and body have not been specified, capture them in the url params
    if (!req.body.tour) req.body.tour = req.params.tourId;
    // req.user comes from the protect middleware
    if (!req.body.user) req.body.user = req.user.id;
    const newReview = await Review.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
});

module.exports = {
    getAllReviews,
    createReview
};