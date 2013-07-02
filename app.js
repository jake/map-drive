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

var markers = io.of('/markers').on('connection', function(socket){
    socket.on('join', function(player){
        socket.set('player_name', player.name);
    });

    socket.on('move', function(data){
        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function(){
        socket.get('player_name', function(err, player_name){
            if (err) throw err;

            console.log('Removing player %j', player_name);
            socket.broadcast.emit('remove', {
                name: player_name,
            });
        });
    });
});

var port = process.env.PORT || 5000;
server.listen(port, function() {
    console.log('Listening on port ' + port);
});
