var https = require('https');

module.exports.getNameForMostPopularVenue =
function(locationCoordinates, callback) {
  var options = {
    host: 'api.foursquare.com',
    path: '/v2/venues/explore?'
          + "ll="
          + locationCoordinates.lat + ","
          + locationCoordinates.lon + "&"
          + "limit=1" + "&"
          + "section=topPicks" + "&"
          + "client_id=" + process.env.FOURSQUARE_KEY + "&"
          + "client_secret=" + process.env.FOURSQUARE_SECRET + "&"
          + "v=" + getCurrentDate()
  }

  https.get(options, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var parsed = JSON.parse(body);
      var items = parsed.response.groups[0].items;

      var venueName = items[0].venue.name;

      callback(venueName);
    });
  });
}

var getCurrentDate = function() {
  var currentDate = new Date();

  var year = currentDate.getFullYear();
  var month = currentDate.getMonth() + 1;
  var zeroBeforeMounth = month < 10 ? "0" : "";
  var day = currentDate.getDate();
  var zeroBeforeDay = day < 10 ? "0" : "";

  return parseInt(year) + zeroBeforeMounth + parseInt(month)
          + zeroBeforeDay + parseInt(day);
}
