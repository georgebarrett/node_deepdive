const fs = require('fs');
const User = require('../models/userModel');
const catchAsyncError = require('../utils/catchAsyncError');
const { features } = require('process');

// JSON.parse means the json from the file will automatically be converted into a javascript object
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    // 500 = internal server error
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users: users
        }
    });
});

const getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defined'
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defined'
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defined'
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'route not yet defined'
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};