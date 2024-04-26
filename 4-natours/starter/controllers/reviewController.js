const Review = require('../models/reviewModel');
const factory = require('./crudFactory');

const setUserAndTourIds = (req, res, next) => {
    // these ifs define the tour and user if they are not present in the request body
    // if the tour id and body have not been specified, capture them in the url params
    if (!req.body.tour) req.body.tour = req.params.tourId;
    // req.user comes from the protect middleware
    if (!req.body.user) req.body.user = req.user.id;
    next();
};

const getAllReviews = factory.getAll(Review);

const getReviewById = factory.getOne(Review);

const createReview = factory.createOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

module.exports = {
    getReviewById,
    getAllReviews,
    createReview,
    updateReview,
    deleteReview,
    setUserAndTourIds
};