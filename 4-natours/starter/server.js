const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./index');

// console.log(process.env);

// STARTING SERVER
// if the 'development' envrionment is activated then the project will work in PORT (defined in .env)
// if not then the project will run on port 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`${port}...`)
});