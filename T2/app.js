var mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    http = require('http'),
    url = require('url');
var bookRoutes = require('./routes/bookRoutes.js');

var db = mongoose.connect('mongodb://localhost/bookAPI');

var port = process.env.PORT || 1338;

var serv = http.createServer(function (req, res) {
  var purl = url.parse(req.url, true);
  if (!purl.pathname.startsWith('/api/books')) {
    res.writeHead(404, {'Content-Type': 'text/plain; charset=UTF-8'});
    res.end({error: "Not found"});
  }
  bookRoutes.handleRouteCall(req, res);
});
serv.listen(port, function(){
  console.log("listening on port: " + port);
});
