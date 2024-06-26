import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });

        if (result.data.status === 'success') {
            showAlert('success', 'Logged in successfully.');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }

    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
        // setting reload to true forces a server reload not a bowser cached reload
        if (res.data.status = 'success') location.href="/";
    } catch (error) {
        showAlert('error', 'Error occurred whilst logging out. Please try again.');       
    }
};