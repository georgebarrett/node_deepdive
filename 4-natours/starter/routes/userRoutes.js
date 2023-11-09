const express = require('express');
const usersController = require('../controllers/usersController');

const routes = express();

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