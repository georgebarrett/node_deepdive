const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncErrors = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const crypto = require('crypto');

const assignToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = assignToken(user._id);
    const cookieOptions = {
        // Date.now() is right now
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        // the cookie cannot be accessed or modified by the browser
        httpOnly: true
    };
    // with 'secure' the cookie will only be sent on an encrypted connection 
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    // jwt is the name of the cookie
    // token is the data i want sent in the cookie
    res.cookie('jwt', token, cookieOptions);

    // removes password from the output
    user.password = undefined;
    
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user,
        },
    });
};

const signup = catchAsyncErrors(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
        role: req.body.role,
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
});

const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('please provide email and password', 400));
    }

    const user = await User.findOne({ email: email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
});

const logout = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: 'success'
    });
};

const protect = catchAsyncErrors(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token || token === 'loggedOut') {
        return next(new AppError('please log in to gain access to tour details', 401));
    }

    const decodedPayload = await util.promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET,
    );

    const freshUser = await User.findById(decodedPayload.id);
    if (!freshUser) {
        return next(new AppError('the user belonging to this token no longer exists', 401));
    }

    if (freshUser.changePasswordAfterAccountCreation(decodedPayload.iat)) {
        return next(new AppError('user recently changed password. please login again', 401));
    }

    req.user = freshUser;
    res.locals.user = freshUser;
    next();
});

// only for rendered pages. there will be no errors
const isLoggedIn = async (req, res, next) => {  
    if (req.cookies.jwt) {
        try {
            // verfies token
            const decodedPayload = await util.promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET,
            );
            // verifies that user exists
            const freshUser = await User.findById(decodedPayload.id);
            if (!freshUser) {
                return next();
            }
            // verifies the most current user password
            if (freshUser.changePasswordAfterAccountCreation(decodedPayload.iat)) {
                return next();
            }
            // THERE IS A LOGGED IN USER
            // the logged in user can be accessed in templates due to calling locals
            res.locals.user = freshUser;
            return next();
        } catch (error) {
            return next();
        }
    }
    next();
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('access denied', 403));
        }
        next();
    };
};

const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('there is no user with that email', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
        });
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('your current password is incorrect', 401))
    }

    user.password = req.body.password;
    user.passwordConfirmation = req.body.passwordConfirmation;
    await user.save();

    createSendToken(user, 200, res);
});

module.exports = {
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword,
    updatePassword,
    isLoggedIn,
    logout
};