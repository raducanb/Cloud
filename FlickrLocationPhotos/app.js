var locationName = 'Munchen';

var coordinatesService = require('./coordinatesService.js');
var flickrService = require('./flickrService.js');
var foursquareService = require('./foursquareService.js');

var locationData = {};

coordinatesService.getCoordinates(locationName,
  function(coordinates){
    console.log("Coordinates of " + locationName + ": " + coordinates);

    var lat = coordinates[0];
    var lon = coordinates[1];

    var locationCoordinates = {};
    locationCoordinates.lat = parseFloat(lat).toFixed(3);
    locationCoordinates.lon = parseFloat(lon).toFixed(3);

    locationData.coordinates = locationCoordinates;

    foursquareService.getNameForMostPopularVenue(locationCoordinates,
      function(venueName){
        console.log("Most popular venue in " + locationName + ": " + venueName);

        locationData.mostPopularVenueName = venueName;

        getPhotosForLocationData(locationData);
      });
    }
  );

var getPhotosForLocationData = function(locationData) {
  flickrService.getPhotos(
    locationData.coordinates,
    locationData.mostPopularVenueName,
    function(photosURLsArray){
      console.log("Photos of venue: ");
      console.log(photosURLsArray);
    });
  };
