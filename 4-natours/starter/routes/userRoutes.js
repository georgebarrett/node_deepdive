const express = require('express');
const usersController = require('../controllers/usersController');
const authcontroller = require('../controllers/authController');

const routes = express();

routes
    .post('/signup', authcontroller.signup)
    .post('/login', authcontroller.login)
    .post('/forgotPassword', authcontroller.login)
    .post('/resetPassword', authcontroller.login)

routes
    .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser)

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(usersController.getUserById)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = routes;