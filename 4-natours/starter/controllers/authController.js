const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsyncErrors = require('../utils/catchAsyncError');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const assignToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = assignToken(user._id);
    
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

const protect = catchAsyncErrors(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
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

    next();
});

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

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}. If you didn't forget your password, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 minutes)',
            message: message,
        });

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
    updatePassword
};