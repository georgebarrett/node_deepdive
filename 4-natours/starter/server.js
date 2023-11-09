const app = require('./index');

// STARTING SERVER
const port = 3000;
app.listen(port, () => {
    console.log(`${port}...`)
});