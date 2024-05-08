const express = require('express');
const morgan = require('morgan');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARE

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// security for headers. essential
app.use(helmet());

app.use(cors({
    origin: 'http://localhost:5173/'
}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

// Handles any requests that don't match the ones above by serving the index.html file
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
// });

// morgan is in this if statement so it will only be activated when the 'development' envirnoment is activated
// this is due to morgan being able to display sensitive information.
// this console log will tell me which environment i am in in throught the terminal
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    // when a request is made, morgan shows some useful stuff in the console
    app.use(morgan('dev')); 
};

// the limit properties depend muchly on the size and scale of the app
const limiter = rateLimit({
    // 100 http requests from the same IP per hour  
    max: 100,
    windowMs: 60 * 60 * 1000,
    // upon exceeding
    message: 'Too many requests from this IP. Please try again in an hour'
});

// the limiter function will only be applied to routes that include /api
app.use('/api', limiter);

// express.json is middleware so that data from the client side can be attached to request objects
app.use(express.json({ limit: '10kb' }));

// DATA SANITISATION - noSQL and XSS

app.use(mongoSanitize());
app.use(xss());
// prevents parameter polution
app.use(hpp({
    // the allowed duplicate parameter properties
    whitelist: [
        'duration', 
        'ratingsQuantity', 
        'ratingsAverage', 
        'maxGroupSize', 
        'difficulty', 
        'price'
    ]
}));

// always pass next into middleware functions otherwise the code gets stuck
app.use((req, res, next) => {
    // this is attaching a date to the request. .toISOString converts the date into a nice string
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'George'
    });
});

app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    });
});

app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Star Gazer Tour'
    });
});

// adding v1 is a form of version control
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`cannot find ${req.originalUrl} on this server...`, 404));
});

app.use(globalErrorHandler);

module.exports = app;