const dotenv = require('dotenv');
const app = require('./index');

dotenv.config({ path: './config.env' });

console.log(process.env);

// STARTING SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`${port}...`)
});