const express = require('express');
const { getAllUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/usersController');

const routes = express();

routes
    .route('/')
    .get(getAllUsers)
    .post(createUser)

routes
    // adding :id creates a variable in the url that can store an id integer
    .route('/:id')
    .get(getUserById)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = routes;