const fs = require('fs');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const multer = require('multer');
const catchAsyncError = require('../utils/catchAsyncError');
const factory = require('./crudFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, 'public/img/users', )
  },
  filename: (req, file, callBack) => {
    // extracting the file extension and how i want to store them
    const extention = file.mimetype.split('/')[1];
    callBack(null, `user-${req.user.id}-${Date.now()}.${extention}`);
  }
});

const multerFilter = (req, file, callBack) => {
  if (file.mimetype.startsWith('image')) {
    callBack(null, true);
  } else {
    callBack(new AppError('Please only upload images.', 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

const uploadUserPhoto = upload.single('photo');

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

const getMe = (req, res, next) => {
  // this means i can use the getOne crud-factory function, which finds the user's id using the url paramters
  // this line assigns the id of the logged in user to the id in the url parameter
  // using this middleware allows a user to retrieve their own data by making a GET
  req.params.id = req.user.id;
  next();
};

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

  // filtering out unwanted field names that cannot be updated
  const filteredBody = filterObject(req.body, 'name', 'email');
  // if there is a photo property then it will be added to the filteredBody object
  // the photo property is equal to the files filename
  if (req.file) filteredBody.photo = req.file.filename;
  // update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, { new: true, runValidators: true });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// user deleting/deactivating their acccount
const deleteMe = catchAsyncError(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status: 'success',
    data: null
  });
});

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route not yet defined. please use /signup instead',
  });
};

const getAllUsers = factory.getAll(User);

const getUserById = factory.getOne(User);

// do not update passwords with this. findByIdAndUpdate in crud-factory nullifies the security middleware
const updateUser = factory.updateOne(User);

const deleteUser = factory.deleteOne(User);

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
  deleteMe,
  uploadUserPhoto
};
