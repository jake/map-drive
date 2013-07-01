var express = require('express');

var emitter = require('./lib/emitter');

var app = express();

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.get('/stream/:id', function(req, res){
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write('\n');

    stream.register(req.params.id, res);

    req.on('close', function() {
        stream.unregister(req.params.id);
    });
});

app.get('/move_player/:name/:position', function(req, res){
    emitter.emit('move_player', {
        name: req.params.name,
        position: req.params.position,
    });
    res.send(':)');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log('Listening on port ' + port);
});
