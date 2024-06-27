/* eslint-disabled */

import '@babel/polyfill';
import { login, logout } from "./login";
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

// DOM elements - to ensure pages without .map do not throw errors
// const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// DELEGATION
// if (mapBox) {
//     const locations = JSON.parse(mapBox.dataset.locations);
//     displayMap(locations);
// };

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
};

if (logOutButton) {
    logOutButton.addEventListener('click', logout);
};

if (userDataForm) {
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        updateSettings({ name, email }, 'data');
    });
};

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').innerHTML = 'Updating...';
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirmation = document.getElementById('password-confirm').value;
        await updateSettings({ passwordCurrent, password, passwordConfirmation }, 'password');

        document.querySelector('.btn--save-password').innerHTML = 'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
};

// Prevent Chrome autofill
const passwordFields = document.querySelectorAll('input[type="password"]');
passwordFields.forEach(field => {
    field.setAttribute('readonly', 'true');
    field.addEventListener('focus', () => {
        field.removeAttribute('readonly');
    });
});
