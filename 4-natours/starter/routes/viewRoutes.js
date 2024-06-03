const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const routes = express.Router();

routes.get('/', viewsController.getOverview);
routes.get('/tour/:slug', authController.protect, viewsController.getTour);
routes.get('/login', viewsController.getLoginForm)

module.exports = routes;