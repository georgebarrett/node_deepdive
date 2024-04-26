const { Model } = require('mongoose');
const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const { populate } = require('../models/reviewModel');

const getOne = (Model, populateOptions) = catchAsyncError(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const document = await query;

    if (!document) {
        return next(new AppError('no document found with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: document
        }
    }); 
});

const createOne = Model => catchAsyncError(async (req, res, next) => {
    const document = await Model.create(req.body)

    res.status(200).json({
        status: 'success',
        message: 'a new document has been created',
        data: {
            data: document
        }
    });
});

const updateOne = Model => catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!document) {
        return next(new AppError('no document found with that id', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'document updated',
        data: {
            data: document
        }
    });
});

const deleteOne = Model => catchAsyncError(async (req, res, next) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) {
        return next(new AppError('no document found with that id', 404));
    }

    res.status(204).json({
        status: 'success',
        message: 'document deleted',
        data: null
    });
});

module.exports = {
    createOne,
    updateOne,
    deleteOne
};