const mongoose = require('mongoose');

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

// instance method for calculating the average rating of tours
// tourId is the id of the tour for which the ratings are calculated
reviewSchema.statics.calcAverageRatings = async function(tourId) {
    // the aggregation pipeline is bound to reviews because of 'this'. only the reviews collection in my db will be interacted with
    const stats = await this.aggregate([
        {
            // $match filters through the document until the tour with the right tour ID is found
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
    console.log(stats);
};

reviewSchema.post('save', function() {
    // this.constructor is used to access the Review model
    // 'this' refers to the current review. tour is the tour id that is getting passed into the calculation function
    this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;