const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const routes = express.Router();

routes.get('/', authController.isLoggedIn, viewsController.getOverview);
routes.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
routes.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
routes.get('/me', authController.protect, viewsController.getAccount);

routes.post('/submit-user-data', authController.protect, viewsController.updateUserData);

module.exports = routes;