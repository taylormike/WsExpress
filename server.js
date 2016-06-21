var ipaddress = 'localhost';
var port = 8080;

var content;
var server = require('http').createServer()
  , url = require('url')
  , WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({host:ipaddress, port:port})
  , express = require('express')
  , app = express()
  , port = 3000;

/*
app.use(function (req, res) {
  res.send({ msg: "hello" });
}); */

pub = __dirname + '/public';
app.use(express.static(pub));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(function(err, req, res, next) {
  res.send(err.stack);
});

wss.broadcast = function(data) {
  for (var i in this.clients)
    this.clients[i].send(data);
};

wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);
  // you might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function(message) {
    content = message;
    wss.broadcast(message);
  });
});

app.get('/', function(req, res){
    res.render('editor', {text: content});
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });
