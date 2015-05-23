var express = require('express');
var app = express();
var http = require('http').Server(app);


app.get('/', function(req, res){
  res.sendFile('/localhost.html', { root: __dirname });
});
app.get('/index.js', function(req, res){
  res.sendFile('/index.js', { root: __dirname });
});

app.use('/lib/',express.static(__dirname + '/lib/'));

http.listen(80,function(){console.log("Server Started.")});