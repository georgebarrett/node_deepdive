const express = require('express');
const viewsController = require('../controllers/viewsController');

const routes = express.Router();

routes.get('/', viewsController.getOverview);
routes.get('/tour/:slug', viewsController.getTour);
routes.get('/login', viewsController.getLoginForm)

module.exports = routes;