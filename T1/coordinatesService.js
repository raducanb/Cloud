var http = require('http');

module.exports.getCoordinates =
function(locationName, callback){
    var options = {
      host: 'dev.virtualearth.net',
      path: '/REST/v1/Locations?q=' + escape(locationName)
            + '&key=' + process.env.VIRTUAL_EARTH_KEY
    }

    http.get(options, function(response) {
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        var parsed = JSON.parse(body);

        var resources = parsed.resourceSets[0].resources;
        callback(resources[0].point.coordinates);
      });
    });
  }
