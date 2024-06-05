/* eslint-disabled */

import '@babel/polyfill';
import { login, logout } from "./login";
import { displayMap } from './mapbox';

// DOM elements - to ensure pages without .map do not throw errors
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logOutButton = document.querySelector('.nav__el--logout');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
};

if (loginForm) {
    document.querySelector('.form').addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
};

if (logOutButton) logOutButton.addEventListener('click', logout);