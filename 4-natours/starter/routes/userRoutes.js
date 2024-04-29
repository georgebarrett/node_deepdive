const express = require('express');
const usersController = require('../controllers/usersController');
const authcontroller = require('../controllers/authController');

const routes = express();

routes
  // first protect middleware, then getMe will assign the id of the user to the URL parameters, then the GET request can be made 
  .get('/me', authcontroller.protect, usersController.getMe, usersController.getAllUsers)
  .post('/signup', authcontroller.signup)
  .post('/login', authcontroller.login)
  .post('/forgotPassword', authcontroller.forgotPassword)
  .patch('/resetPassword/:token', authcontroller.resetPassword)
  .patch('/updateMyPassword',authcontroller.protect,authcontroller.updatePassword)
  .patch('/updateMe', authcontroller.protect, usersController.updateMe)
  .delete('/deleteMe', authcontroller.protect, usersController.deleteMe);

routes
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

routes
  // adding :id creates a variable in the url that can store an id integer
  .route('/:id')
  .get(usersController.getUserById)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = routes;
