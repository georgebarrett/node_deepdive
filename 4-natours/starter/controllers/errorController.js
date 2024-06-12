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

const sendDevError = (err, req, res) => {
    // api
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    }
    // rendered page
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong...',
        msg: err.message
    });
};

const sendProdError = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        console.error('error', err);

        return res.status(500).json({
            status: 'error',
            message: 'something went wrong...'
        });
    }
    // B
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong...',
            message: err.message
        });
    }
    console.error('error', err);

    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong...',
        msg: 'Please try again later.'
    });
};

const handleJwtError = () => new AppError('invalid token. please login again', 401);

const handleJwtExpiryError = () => new AppError('your token has expired. please login again', 401);


module.exports = (err, req, res, next) => {
    console.log(err)
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendDevError(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastError(err);
        if (err.code === 11000) err = handleDuplicateFields(err);
        if (err.name === 'ValidationError') err = handleValidationError(err);
        if (err.name === 'JsonWebTokenError') err = handleJwtError()
        if (err.name === 'TokenExpiredError') err = handleJwtExpiryError();

        sendProdError(err, req, res);
    }    
};
