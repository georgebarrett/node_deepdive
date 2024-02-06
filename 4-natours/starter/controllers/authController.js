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

const signup = catchAsyncErrors(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    role: req.body.role,
  });

  const token = assignToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  // correctPassword comes from an instance method in the userModel
  // if user exists and their password and encrypted password match then we move on
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('incorrect email or password', 401));
  }

  const token = assignToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
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
    return next(
      new AppError('please log in to gain access to tour details', 401),
    );
  }

  // verify is an asynchronous fucntion
  const decodedPayload = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  // if user changes their password after the token has been issued. the old jwt should not be valid
  const freshUser = await User.findById(decodedPayload.id);
  if (!freshUser) {
    return next(
      new AppError('the user belonging to this token no longer exists', 401),
    );
  }

  // this ensures their new jwt token is valid
  if (freshUser.changePasswordAfterAccountCreation(decodedPayload.iat)) {
    return next(
      new AppError('user recently changed password. please login again', 401),
    );
  }

  req.user = freshUser;

  next();
});

// the return middleware function gets access to the roles parameter
// the roles are assigned to users like ['admin'], which give them more permission rights
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
  // the validate before save bypasses any validators
  await user.save({ validateBeforeSave: false });

  // this is the reset URL that sends a http request when the user clicks the password reset button in the email
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? please submit a PATCH request with your new password to: ${resetURL}\nif you haven't forgotten your password then please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token (valid for 10 minutes)',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token sent to email',
    });
    // this catch block resets the token and the expires property
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    // because the catch modifies the data and doesn't save it I bypass my validators
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('there was an error sending the email. please try again'),
      500,
    );
  }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // getting user based on their token. mongo query also checking if their token has expired
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // if the token has not expired and there is a user
  if (!user) {
    return next(new AppError('token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  // i want my validators to run to ensure passwords and tokens match
  await user.save();

  const token = assignToken(user._id);

  res.status(200).json({
    status: 'success',
    token: token
  })
});

module.exports = {
  signup,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
};
