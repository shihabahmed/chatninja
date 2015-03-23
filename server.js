var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));

app.get('/', function(req, res){
    res.sendFile('/index.html');
});

var socketListener = require('./socketlistener.js');
socketListener.init(io);

http.listen(process.env.PORT || 3000);
