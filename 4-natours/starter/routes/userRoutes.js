const express = require('express');
const usersController = require('../controllers/usersController');
const authcontroller = require('../controllers/authController');

const routes = express();

routes
  .post('/signup', authcontroller.signup)
  .post('/login', authcontroller.login)
  .post('/forgotPassword', authcontroller.forgotPassword)
  .patch('/resetPassword/:token', authcontroller.resetPassword)
  
// this line applies the protect functionality to all the routes below
routes.use(authcontroller.protect);

routes
  // first protect middleware, then getMe will assign the id of the user to the URL parameters, then the GET request can be made 
  .get('/me', usersController.getMe, usersController.getUserById)
  .patch('/updateMyPassword', authcontroller.updatePassword)
  .patch('/updateMe', usersController.updateMe)
  .delete('/deleteMe', usersController.deleteMe);

routes.use(authcontroller.restrictTo('admin'));

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
