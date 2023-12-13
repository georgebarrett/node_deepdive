const sendDevError = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        error: error,
        message: error.message,
        stack: error.stack
    });
};

const sendProdError = (error, res) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
    });
};

module.exports = (error, req, res, next) => {
    
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendDevError(error, res);
    } else if (process.env.NODE_ENV === 'production') {
        sendProdError(error, res);
    }  
};
