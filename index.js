var express = require('express')

var requester = require('./src/requester.js');

var app = express()

app.get('/:image', requester.things);
app.get('/things/:image', requester.things);
app.get('/people/:image', requester.people);

var server = app.listen(3000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});