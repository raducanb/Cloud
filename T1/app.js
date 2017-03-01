var coordinatesService = require('./coordinatesService.js');
var flickrService = require('./flickrService.js');
var foursquareService = require('./foursquareService.js');
var express = require('express');
var bodyParser = require('body-parser');

var locationData = {};

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/photos', function (req, res) {
  locationName = req.query.location;
  coordinatesService.getCoordinates(locationName,
    function (coordinates) {
      var lat = coordinates[0];
      var lon = coordinates[1];

      var locationCoordinates = {};
      locationCoordinates.lat = parseFloat(lat).toFixed(3);
      locationCoordinates.lon = parseFloat(lon).toFixed(3);

      locationData.coordinates = locationCoordinates;

      foursquareService.getNameForMostPopularVenue(locationCoordinates,
        function (venueName) {
          locationData.mostPopularVenueName = venueName;
          getPhotosForLocationData(locationData);
        });
    }
  );

  var getPhotosForLocationData = function (locationData) {
    flickrService.getPhotos(
      locationData.coordinates,
      locationData.mostPopularVenueName,
      function (photosURLsArray) {
        locationData.photosURLsArray = photosURLsArray;
      });
  };


    }
  }
});

app.listen(8080, function () { });