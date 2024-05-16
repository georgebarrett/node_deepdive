const express = require('express');

const routes = express.Router();

routes.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Shoe Gazer',
        user: 'George'
    });
});

routes.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All Tours'
    });
});

routes.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The Shoe Gazer Tour'
    });
});

module.exports = routes;