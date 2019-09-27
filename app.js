//jshint esversion:6

var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

const mongoose = require("mongoose");

var lastOperation = 0;
var arrayResult = [];
var resultNumv = 0;
var theNumv = 0;





/*
mongoose.connect("mongodb://amkurian:amkurian1@ds257981.mlab.com:57981/simple-chat", {
  useNewUrlParser: true
});

*/





io.on('connection', function(socket) {
  console.log("Socket ID " + socket.id);



  socket.on('theNumv', function(data) {

    theNumv = data.resultNum;

    io.emit('displayResult', {
      resultNum: theNumv,
      arrayResult: arrayResult

    });

  });



  socket.on('resultNum', function(data) {

    lastOperation = data.resultNum;
    if (data.resultNum ) {
      arrayResult.push(data.resultNum);
    }

    console.log("array "+arrayResult);

    console.log("Result of currrent operation: " + lastOperation);

    //io.sockets.emit('displayResult', {
    io.emit('displayResult', {
      resultNum: lastOperation,
      arrayResult: arrayResult
    });

    /*  socket.broadcast.emit('displayResult', {
        resultNum: lastOperation,
        arrayResult: arrayResult
      }); */


  });


  socket.on('join', function(name) {




    console.log("joing user" + socket.id);
    socket.username = socket.id;

    // additional users will join the 'guesser' room
    socket.join('guesser');
    io.in(socket.username).emit('guesser', socket.username);

    // update all clients with the list of users
    //  io.emit('userlist', users);

    //io.sockets.emit('displayResult', {
    io.emit('displayResult', {
      resultNum: lastOperation,
      arrayResult: arrayResult
    });

  });



})


server.listen(process.env.PORT || 3000, function() {
  console.log('Server started at http://localhost:3000');
});
