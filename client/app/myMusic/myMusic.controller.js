'use strict';

(function() {

  angular.module('myappApp')
    .controller('myMusicCtrl', ['$scope', '$http', function($scope, $http) {
      var treeCtlScope = $scope;
      $scope.artists = [];
      $scope.musicLocation = "Y:/My Music";
      $scope.artistSets = [];
      $scope.selArtist = "";

      function processMusicData (response) {
        treeCtlScope.artists = response.data.artists;
        treeCtlScope.musicLocation = response.data.baseDir;
        treeCtlScope.artistSets = [];
        treeCtlScope.selArtist = "";
      var artistSetsObj = {};

        // Walk the artists and sort, create a tree structure
        angular.forEach(treeCtlScope.artists, function(artist) {
          //console.log("Original Artist Name: " + artist.name);
          var sortableArt = artist.name.replace(/^\W+/, ""); // Remove any non-alphas from beginning
          sortableArt = sortableArt.replace(/^The /, ""); // Remove leading the
          //console.log("Sortable artist - " + sortableArt);
          var letter = sortableArt.substring(0, 1).toUpperCase();
          if (artistSetsObj[letter]) {
            artistSetsObj[letter].push(artist);
          } else {
            artistSetsObj[letter] = [artist];
          }

        });

        // Convert the artistSet object into a sorted array

        angular.forEach(artistSetsObj, function(value, key) {
          treeCtlScope.artistSets.push({
            letter: key,
            artists: value
          });

        });

      }

//      $http.get('mytunes.json', {
      $http.get('api/tunes', {
        cache: true
      }).then(function successCb(response) {

        console.log("Got Tunes Data");
        processMusicData(response);

      }, function errorCb(response) {
        // Handle the error
        alert("Request for mytunes.json yielded error: " + response.status + " : " + response.data);
      });

      $scope.freshScan = function() {
        if (confirm("Are you sure you want to do a fresh Scan?\n\nThis will eleminate all meta-data!")) {
          $http({
            method: 'GET',
            url: '/api/tunes/search',
            params: {
//              "directory": $scope.musicLocation
              "directory": "Y:/My Music"
            }
          }).success(function(data) {
            alert("Scan Successful!\n\nReprocesing Data");
            //console.log(JSON.stringify(data));
            processMusicData(response);
          }).error(function(data, status, headers, config) {
            // Handle the error
            alert("Music data scan failed with status: " + status + " : " + data);
          });
        }
      };
      $scope.updateScan = function() {
        if (confirm("Make sure you save before any meta-data in browser before updating...")) {
          $http({
            method: 'POST',
            url: '/api/tunes/update',
            data: {
              "directory": $scope.musicLocation
            }
          }).then(function (response) {
            processMusicData(response);
            alert("Update Successful!");
            //console.log(JSON.stringify(data));
          }, function errCb(response) {
            // Handle the error
            alert("Music data save failed with status: " + response.status + " : " + response.data);
          });

        }
      };
      $scope.saveChanges = function() {
        // Delete client side data from all the artists
        angular.forEach($scope.artists, function(artist) {
          delete artist.edit;
        });
        var c2String = angular.toJson($scope.artists);

        $http({
          method: 'POST',
          url: '/api/backups/',
          data: {
            "c2_data": c2String,
            "bkfile": "mytunes"
          }
        }).success(function(data) {
          alert("Music Data Saved!\n\n" + data);
        }).error(function(data, status, headers, config) {
          // Handle the error
          alert("Music data save failed with status: " + status);
        });

      };

      $scope.selectArtist = function(artist) {
        $scope.selArtist = artist;
        artist.edit = false;
      };

      $scope.setArtistImage = function(artist) {
        var imgUrl = prompt("Enter URL for image of " + artist.name, artist.image);
        if (imgUrl) {
          artist.image = imgUrl;
        }
      };
      $scope.setAlbumImage = function(album) {
        var imgUrl = prompt("Enter URL for image of " + album.name, album.image);
        if (imgUrl) {
          album.image = imgUrl;
        }

      };

    }]); // end controller
})();
