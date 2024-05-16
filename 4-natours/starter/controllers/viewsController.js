const Tour = require('../models/tourModel');
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

const getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating user'
    })
    
    res.status(200).render('tour', {
        title: 'The Shoe Gazer',
        tour: tour
    });
});

module.exports = {
    getOverview,
    getTour
}