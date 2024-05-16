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

const getTour = (req, res) => {
    res.status(200).render('tour', {
        title: 'The Shoe Gazer Tour'
    });
};

module.exports = {
    getOverview,
    getTour
}