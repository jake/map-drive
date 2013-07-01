var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var emitter = require('./lib/emitter');

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

io.sockets.on('connection', function (socket){
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data){
        console.log(data);
    });
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log('Listening on port ' + port);
});
