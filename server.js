var express = require('express'),
    http = require('http'),
    _ = require('underscore'),
    events = require('events');

var gsApiKey = '9eb8df56a6583b5d15efd6da50f9dc7f'
var app = express.createServer();
var io = require('socket.io').listen(app);
var port = 80;

var transports = ['websocket', 'flashsocket',  'xhr-polling', 'htmlfile', 'jsonp-polling'];
io.configure(function() {
    io.set('transports', transports);
});
io.configure('production', function(){
    io.enable('browser client etag');
    io.set('log level', 1);
});

app.configure(function() {
    app.set('views', __dirname + '/templates/');
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({secret: '$3CR3#'}));
    app.use(app.router);


    app.use('/media', express.static(__dirname + '/media'));
    app.use('/', express.static(__dirname + '/templates/'));
});
app.configure('production', function() {
    app.set('log level', 1);
    app.use(express.errorHandler());
});
app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.register('.html', {
    compile: function (str, options) {
        var template = _.template(str);
        return function (locals) {
          return template(locals);
        };
    }
});

app.get('/', function(req, res){
    console.log('*****SESSION: ' + req.user);
    res.render('index.html', {layout: false});
});


app.listen(port);
console.log('Listening on port ' + app.address().port);

io.sockets.on('connection', function(socket) {
    console.log('Connected')
    console.dir(socket);


    var tinySongClient = http.createClient(80, "tinysong.com");  
  
    var tinySongEmitter = new events.EventEmitter();  

    function searchTinySong(options) {  
        var request = tinySongClient.request("GET", options.path, {"host": options.host});  
  
        request.addListener("response", function(response) {  
            var body = "";  
            response.addListener("data", function(data) {  
                body += data;  
            });  
  
            response.addListener("end", function() {  
                var searchResponse = JSON.parse(body);  
                if(searchResponse.length > 0) {  
                    tinySongEmitter.emit("searchResponse", searchResponse);  
                }  
            });  
        });  
  
        request.end();  
    }  

    
    socket.on('search', function(data){
        var options = {
            host: 'tinysong.com',
            port: 80,
            path: '/s/'+data.query.replace(/ /, '+')+'?format=json&limit=3&key='+gsApiKey
        };

        searchTinySong(options);

        tinySongEmitter.on('searchResponse', function(res) {
            console.log("Got response: " + res.statusCode);
            // socket.emit('searchResponse', [{SongName: 'blah', Url: 'jfdklsjfd'},{SongName: 'blah', Url: 'jfdklsjfd'},{SongName: 'blah', Url: 'jfdklsjfd'}]);
            socket.emit('searchResponse', res);
        });
                        
    });
});

