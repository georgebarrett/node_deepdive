const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

const reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, 'please enter a review']
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            // this points to the Tour collection
            ref: 'Tour',
            required: [true, 'a review must belong to a tour']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'a review must belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.pre(/^find/, function(next) {
    // .populates can be chained together to produce more nested field
    // in this case i just want the user's name to appear in the user object that is nested in the reviews object 
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

// static method so 'aggregate' could be used. static methods influence the model itself
// tourId is the id of the tour for which the ratings are calculated
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    // the aggregation pipeline is bound to reviews because of 'this'
    const stats = await this.aggregate([
        {
            // selecting all the revews that match the tourId
            $match: { tour: tourId }
        },
        {
            $group: {
                // this groups documents based on the 'tour' field
                _id: '$tour',
                // counts the number of reviews for each tour. incrementing by 1
                numOfRatings: { $sum: 1 },
                // calculates the rating for each group using the $avg operator
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    if (stats.length > 0 ) {
        // saving the stats from the pipeline to the tour in the database
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].numOfRatings,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        // this is the default for when there are no reviews
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }   
};

reviewSchema.post('save', function() {
    // this.constructor is used to access the Review model
    // 'this' refers to the current review. tour is the tour id that is getting passed into the calculation function
    this.constructor.calcAverageRatings(this.tour);
});

// method for updating a review
reviewSchema.pre(/^findOneAnd/, async function(next) {
    // findOne retrieves the current document from the database and stores it in this.review. the current query variable
    this.review = await this.clone().findOne();
    next();
});

// method for performing the new review calculations 
reviewSchema.post(/^findOneAnd/, async function() {
    // due to this.review i can call the calcAverageRatings function
    await this.review.constructor.calcAverageRatings(this.review.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;