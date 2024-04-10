const fs = require('fs');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsyncError = require('../utils/catchAsyncError');
const { features } = require('process');

const filterObject = (object, ...allowedFields) => {
  const newObject = {};
  // looping through an object in javascript
  // returns an array containing all the key names
  // can then use forEach to loop through them
  Object.keys(object).forEach(el => {
    if (allowedFields.includes(el)) newObject[el] = object[el];
  });
  return newObject;
}

// JSON.parse means the json from the file will automatically be converted into a javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  // 500 = internal server error
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
});

// updating the currently athenticated user
const updateMe = catchAsyncError(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirmation) {
    return next(
      new AppError(
        'this route is not for password updates. please use /updateMyPassword',
        400,
      ),
    );
  }
  // filtering out unwanted field names
  const filteredBody = filterObject(req.body, 'name', 'email');
  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators: true});

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined',
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateMe
};
