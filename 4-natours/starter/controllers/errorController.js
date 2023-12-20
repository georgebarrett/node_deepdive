const AppError = require('../utils/appError');

const handleCastError = err => {
    const message = `invalid ${err.path}: ${err.value}`
    return new AppError(message, 400);
};

const handleDuplicateFields = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `duplicate field value:${value}. please enter another`;

    return new AppError(message, 400);
};

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(el => {
        if (el.path === 'difficulty' && el.kind === 'enum') {
            return 'tour difficulty must be easy, medium or difficult';
        }
        return el.message;
    });
    const message = `Invalid input data. ${errors.join('. ')}`;
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

const handleJwtError = err => new AppError('invalid token. please login again', 401);

const handleJwtExpiryError = err => new AppError('your token has expired. please login again', 401);


module.exports = (err, req, res, next) => {
    console.log(err)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastError(err);
        if (err.code === 11000) err = handleDuplicateFields(err);
        if (err.name === 'ValidationError') err = handleValidationError(err);
        if (err.name === 'JsonWebTokenError') err = handleJwtError(err)
        if (err.name === 'TokenExpiredError') err = handleJwtExpiryError(err);

        sendProdError(err, res);
    }    
};
