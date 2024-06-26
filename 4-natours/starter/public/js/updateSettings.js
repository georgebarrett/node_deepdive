/* eslint-disabled */

import axios from 'axios';
import { showAlert } from './alerts';

// type is either password or name & email
export const updateSettings = async (data, type) => {
    try {
        console.log('Data to be sent:', data);
        const url = type === 'password' 
            ? 'http://localhost:3000/api/v1/users/updateMyPassword' 
            : 'http://localhost:3000/api/v1/users/updateMe';

        console.log('URL:', url);

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        console.log('Response:', res);

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
        }

    } catch (error) {
        console.error('Error:', error);
        showAlert('error', error.response.data.message)
    }
};