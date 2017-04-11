var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (req, res) {
  var purl = url.parse(req.url,true);
  var re = new RegExp("/test  /[a-zA-Z0-9]+/*");
  if(purl.pathname=='/test')
  {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
    if(req.method == 'GET') {
      res.end('Test get');
    }
  } else if (re.test(purl.pathname)) {
      res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
      if(req.method == 'GET') {
        res.end('Test get id');
      }
  } else
  {
    res.writeHead(200, {'Content-Type': 'text/plain; charset=UTF-8'});
    fs.readFile('serv-vanilla.js', function (err, data){
     if (err) throw err;
     res.end(data);
    });
  }

}).listen(1337);

console.log('Server running at http://127.0.0.1:1337/');
