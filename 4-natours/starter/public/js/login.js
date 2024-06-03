const login = async (email, password) => {
    console.log(email, password);
    try {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        });
        console.log(result);
    } catch (error) {
        console.log('Error:', error.response ? error.response.data : error.message);
    }
};

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});