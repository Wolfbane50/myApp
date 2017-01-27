'use strict';

(function() {
  class MyMusicComponent {
  constructor($http, $scope) {
    this.$http = $http;
    this.$scope = $scope;

    this.artists = [];
    this.musicLocation = "Y:/My Music";
    this.artistSets = [];
    this.selArtist = "";

    // define all functions
    this.processMusicData = function (response) {
      this.artists = response.data;
//      this.artists = response.data.artists;
      this.musicLocation = response.data.baseDir;
      this.artistSets = [];
      this.selArtist = "";
      var artistSetsObj = {};

      // Walk the artists and sort, create a tree structure
      angular.forEach(this.artists, function(artist) {
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
      var myArtistSets = this.artistSets;
      angular.forEach(artistSetsObj, function(value, key) {
        myArtistSets.push({
          letter: key,
          artists: value
        });
      });
    };

      this.freshScan = function() {
        if (confirm("Are you sure you want to do a fresh Scan?\n\nThis will eleminate all meta-data!")) {
          this.$http.get('/api/tunes/search', {
            params: {
//              "directory": this.musicLocation
              "directory": "Y:/My Music"
            }
          }).then(response => {
            alert("Scan Successful!\n\nReprocesing Data");
            //console.log(JSON.stringify(data));
            this.processMusicData(response);
          }, function errorCallback(response) {
            // Handle the error
            alert("Music data scan failed with status: " + response.status + " : " + response.data);
          });
        }
      };
      this.updateScan = function() {
        if (confirm("Make sure you save before any meta-data in browser before updating...")) {
          this.$http.post('/api/tunes/update',{
              data: {
              "directory": this.musicLocation
            }
          }).then(response => {
            this.processMusicData(response);
            alert("Update Successful!");
            //console.log(JSON.stringify(data));
          }, function errorCallback(response) {
            // Handle the error
            alert("Music data save failed with status: " + response.status + " : " + response.data);
          });

        }
      };

      this.saveChanges = function() {
        // Delete client side data from all the artists
        angular.forEach(this.artists, function(artist) {
          delete artist.edit;
        });
        var c2String = angular.toJson(this.artists);

        this.$http.post('/api/backups/', {
          data: {
            "c2_data": c2String,
            "bkfile": "mytunes"
          }
        }).then(response => {
          alert("Music Data Saved!\n\n" + response.data);
        }, function errorCallback(response) {
          // Handle the error
          alert("Music data save failed with status: " + response.status);
        });

      };

      this.selectArtist = function(artist) {
        this.selArtist = artist;
        artist.edit = false;
      };

      this.setArtistImage = function(artist) {
        var imgUrl = prompt("Enter URL for image of " + artist.name, artist.image);
        if (imgUrl) {
          artist.image = imgUrl;
        }
      };
      this.setAlbumImage = function(album) {
        var imgUrl = prompt("Enter URL for image of " + album.name, album.image);
        if (imgUrl) {
          album.image = imgUrl;
        }

      };

  }  // end constructor

  $onInit() {
      this.$http.get('api/tunes', {
        cache: true
      }).then(response => {

        console.log("Got Tunes Data");
        //console.log("Data => " + JSON.stringify(response.data));
        this.processMusicData(response);

      }, function errorCb(response) {
        // Handle the error
        alert("Request for mytunes.json yielded error: " + response.status + " : " + response.data);
      });

  } // end onInit
} // end component class

angular.module('myappApp')
  .component('myMusicComponent', {
    templateUrl: 'app/myMusic/myMusic.html',
    controller: MyMusicComponent
  });

})();
