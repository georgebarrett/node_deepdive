const AppError = require('../utils/appError');

const handleCastError = err => {
    const message = `invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
};

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

const sendProdError = (err, res) => {
    if (err.isOperational) {
        console.log({"prod": err})
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('error', err);

        res.status(500).json({
            status: 'error',
            message: 'something went wrong...'
        });
    }
};

module.exports = (err, req, res, next) => {
    console.log(err)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastError(err);

        sendProdError(err, res);
    }  
};
