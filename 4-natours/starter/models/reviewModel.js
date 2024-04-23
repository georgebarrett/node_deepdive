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
    this.populate({
        // this points to the tour field
        path: 'tour',
        selct: 'name'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;