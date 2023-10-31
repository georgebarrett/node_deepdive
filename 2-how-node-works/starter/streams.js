const fs = require('fs');

// short hand for creating a new server
const server = require('http').createServer();

// server.on registers a request event listener. this is emitted every time a new request comes in
server.on('request', (req, res) => {
    // this code reads the text file in an asynchronous fashion. because it is asynchronous it won't 
    // block the execution of other code whilst the file is being read 
    fs.readFile('test-file.txt', (err, data) => {
        // once the file has been read or an error has occured then this callback function is executed
        if (err) console.log(err);
        // this will send the data from the text file to the server
        res.end(data);
    });
});

// activating server
server.listen(8000, '127.0.0.1', () => {
    console.log('listening...');
});