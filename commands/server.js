
var express = require('express')
var app = express()
var open = require("open");

function serve(path){
var port = 3000;
app.use(express.static(path))
app.listen(port, function () {
  var url  = "http://localhost:" + port;
  console.log('Listening ' + url);
  open(url);
})
}
exports.serve = serve;