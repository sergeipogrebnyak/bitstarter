#!/usr/bin/node

var express = require('express');

var app = express.createServer(express.logger());

var fs = require('fs');

var indexHtml = fs.readFileSync('index.html');

app.get('/', function(request, response) {
    response.send(indexHtml.toString());
});


app.get('/images/cc.png', function(request, response) {
    response.send(fs.readFileSync('images/cc.png')); 
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
