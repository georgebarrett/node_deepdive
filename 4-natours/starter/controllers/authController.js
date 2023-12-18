const User = require('../models/userModel');
const catchAsyncErrors = require('../utils/catchAsyncError');

const signup = catchAsyncErrors(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

module.exports = {
    signup
};