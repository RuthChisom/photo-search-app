var app = angular.module('flickrApp', ['ngResource']);

app.factory('Flickr', function($resource, $q) {
  var photosPublic = $resource('https://api.flickr.com/services/feeds/photos_public.gne?tags=trees&format=json', 
      { format: 'json', jsoncallback: 'JSON_CALLBACK' }, 
      { 'load': { 'method': 'JSONP' } });
  
  return {
    get: function() {
      var q = $q.defer();
      photosPublic.load(function(resp) {
        q.resolve(resp);
        console.log(resp.items);
      })
      return q.promise;
    }
  }
});
app.controller('FlickrCtrl', function($scope, $http, Flickr) {
  // $scope.master = {};
  // $scope.images = {};
  $scope.search = function (searchCriteria) {
    if (searchCriteria.tags == undefined || searchCriteria.tags.trim() == "") {
      searchCriteria.tags = null;
      $scope.master = angular.copy(searchCriteria);
      $scope.form.$submitted = true;
      return false;
    }
    // build URL for Flickr API
    var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne";
    flickrAPI = flickrAPI + "?jsoncallback=JSON_CALLBACK"
          + "&tags=" + encodeURIComponent($scope.searchCriteria.tags)
          + "&format=json";
    // send AJAX query to Flickr API
    $http.jsonp(flickrAPI)
    .success(function (data, status, headers, config) {
        console.log(data,status);
        $scope.images = data;
        $scope.imagesStatus = status;
    })
    // trap error if any
    .error(function (data, status, headers, config) {
      $scope.images = data;
      $scope.imagesStatus = status;
      console.log(data,status);
    });

  }
  
  // reset form to initial state
  $scope.resetForm = function (form) {
    $scope.form.tags.$setValidity();
    $scope.images = {};
    $scope.searchCriteria = {};
  };

  // Flickr.get();
  
});
