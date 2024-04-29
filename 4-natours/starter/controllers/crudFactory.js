const catchAsyncError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const getAll = Model => catchAsyncError(async (req, res, next) => {
    // the two lines below allow for nested GET reviews on a tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    
    const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
    // query now lives in 'features' which is the new object stored in a variable
    // .explain() = in-built function that adds stats to a query
    const document = await features.query.explain();

    res.status(200).json({
        status: 'success',
        results: document.length,
        data: {
            data: document
        }
    });
});

const getOne = (Model, populateOptions) => catchAsyncError(async (req, res, next) => {
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
    getOne,
    getAll,
    createOne,
    updateOne,
    deleteOne
};