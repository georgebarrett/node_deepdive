const fs = require('fs');

// short hand for creating a new server
const server = require('http').createServer();

// solution 1
// it's important to note that this approach is only ideal for small text files
// server.on registers a request event listener. this is emitted every time a new request comes in
server.on('request', (req, res) => {
    // this code reads the text file in an asynchronous fashion. because it is asynchronous it won't 
    // block the execution of other code whilst the file is being read 
    
    // fs.readFile('test-file.txt', (err, data) => {
    
    // once the file has been read or an error has occured then this callback function is executed
    // if (err) console.log(err);
    
    // this will send the data from the text file to the server
    // res.end(data);
    // });

    // solution 2: streams
    // this approach streams the content of the file to client rather than storing it as a variable and sending the entire piece
    
    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', chunk => {
    
    //     this streams/writes all the data chunk by chunk
    //     res.write(chunk);
    // });
    
    // this is to handle the stream once the data is read
    // the end event is ommitted
    // readable.on('end', () => {
    
    //     the response is a stream therefore the 'end' method needs to be called to signify that there is no more data
    //     nothing needs to be passed into the 'end' method because the data has been written using the 'res.write(chunk)' above    
    //     res.end();
    // });
    
    //  error event for a readable stream
    // readable.on('error', err => {
    
    //     this call back function will be executed when the error even is emitted
    //     console.log(err);
    
    //     500 indicates a serverside error
    //     res.statusCode= 500;
    
    //     file not found will be the repsonse that the client will see on the browser
    //     res.end('file not found');
    // });

    // solution 3
    // using the pipe operator to control the speed of data coming in and out
    const readable = fs.createReadStream('test-file.txt');

    readable.on('error', err => {
        console.log(err);
        res.statusCode = 500;
        res.end('file not found');
    });

    readable.pipe(res);
});

// activating server
server.listen(8000, '127.0.0.1', () => {
    console.log('listening...');
});