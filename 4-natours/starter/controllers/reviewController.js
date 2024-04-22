const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsyncErrors = require('../utils/catchAsyncError');

const getAllReviews = catchAsyncErrors(async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            review: reviews
        }
    });
});

const createReview = catchAsyncErrors(async (req, res, next) => {
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