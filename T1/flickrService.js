var https = require('https');

module.exports.getPhotos =
function(locationCoordinates, venueName, callback) {
  var options = {
    host: 'api.flickr.com',
    path: '/services/rest/?method=flickr.photos.search&'
          + "lat=" + locationCoordinates.lat + "&"
          + "lon=" + locationCoordinates.lon + "&"
          + "text=" + escape(venueName) + "&"
          + "per_page=5&format=json&nojsoncallback=1&media=photos&"
          + "api_key=" + process.env.FLICKR_KEY
  }

  https.get(options, function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var parsed = JSON.parse(body);

      var photosArray = parsed.photos.photo;
      var photosURLsArray = getPhotosURLsFromPhotosArray(photosArray);
      callback(photosURLsArray);
    });
  });
}

var getPhotosURLsFromPhotosArray = function(photosArray) {
  var photosURLsArray = [];

  photosArray.forEach(function(element, index, array){
    var photoURL = photoURLFromFlickrData(element.farm,
                                          element.server,
                                          element.id,
                                          element.secret);
    photosURLsArray.push(photoURL);
  });

  return photosURLsArray;
}

var photoURLFromFlickrData = function(farmID, serverID, photoID, secret) {
  return 'https://farm' + farmID + '.staticflickr.com/' + serverID
          + '/' + photoID + '_' + secret + '_b.jpg';
}
