import axios from 'axios';
import { showAlert } from './alerts';

const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
            data: {
                name: name,
                email: email
            }
        });

        if (res.data.status === 'success') {
            showAlert('success', 'user data updated');
        }

    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

module.exports = {
    updateData
};