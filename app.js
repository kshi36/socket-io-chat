/**
 * Entry point of app.
 */

// node modules
var express = require('express');
var http = require('http');
var { Server } = require('socket.io');

// set up express & http server
var app = express();
var server = http.createServer(app);

// set up socket.io (mount on http server)
var io = new Server(server);    //server socket

// router for "/"
app.get('/', (req, res) => {
    //send index file as response
    res.sendFile(__dirname + '/index.html');
});

// event listener for socket.io (server socket) connection
io.on('connection', (clientSocket) => {
    // event listener for join event (naming a client)
    clientSocket.on('join', (name) => {
        //set client's username
        clientSocket.username = name;

        console.log('Client ' + name + ' connected...');
    });

    // event listener for chat message event
    clientSocket.on('chat msg', (msg) => {
        //get username of client b4 sending message to server
        var name = clientSocket.username;
        console.log('message by ' + name + ': ' + msg);

        //emit message from server to all clients (incl. sender)
        io.emit('chat msg', name + ': ' + msg);
    });

    // event listener for client socket disconnect
    clientSocket.on('disconnect', () => {
        console.log('Client ' + clientSocket.username + ' disconnected.');
    });
});

server.listen(process.env.PORT || 3000, () => {
   console.log('Listening on port 3000');
});