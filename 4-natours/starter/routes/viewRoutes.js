const express = require('express');
const viewsController = require('../controllers/viewsController');

const routes = express.Router();

routes.get('/', viewsController.getOverview);
routes.get('/tour', viewsController.getTour);

module.exports = routes;