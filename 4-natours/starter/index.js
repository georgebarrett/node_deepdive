const express = require('express');

const app = express();

app.listen()

// once the home page url has been hit. the callback function will fire
app.get('/', (req, res) => {
    // using the response object to send a json object. the .json method is a send method
    res.status(200).json({
        message: 'come to the Serverside Luke',
        app: 'Natours'
    });
});

app.post('/', (req, res) => {
    res.send('you can post stuff to this endpoint...')
});

const port = 3000;
app.listen(port, () => {
    // this will appear as soon as the server starts listening. classic callback
    console.log(`${port}...`)
});