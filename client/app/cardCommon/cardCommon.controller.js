'use strict';

(function() {

  angular.module('myappApp')
    .config(function(LightboxProvider) {
      LightboxProvider.getImageUrl = function(card) {
        if (card.link) {
          return card.link
        }
        if (card.fname) {
          return "cards/" + path + "/" + card.fname;
        }
        if (card.id) {
          return "https://drive.google.com/uc?export=view&id=" + card.id;
        }
        return "#"; // Default if we cannot figure out image link
      };

      LightboxProvider.getImageCaption = function(card) {
        return card.name;
      };
    });

  angular.module('myappApp')
    .controller('cardCtrl', ['$scope', '$http', 'Lightbox', function($scope, $http, Lightbox) {
      $scope.myJSON = "chachis3.json";
      $scope.jsonFiles = ['chachis3.json', 'bunt.json', 'ss_cards.json'];
      $scope.cardSets = [];
      $scope.mySet = "";
      $scope.cards = [];
      var chachiScope = $scope;


      // http get the json file

      $http({
        method: 'GET',
        url: 'chachis3.json'
      }).success(function(data) {
        //   $http({ method: 'GET', url: 'chachis4.json' }).success(function(data) {
        chachiScope.cardSets = data;
        chachiScope.mySet = chachiScope.cardSets[0];
        chachiScope.cards = chachiScope.mySet.cards;
      }).error(function(data, status, headers, config) {
        // Handle the error
        alert("Request for Card data yielded error: " + status);
      });

      $scope.loadSets = function() {
        var jsonFile = $scope.myJSON;
        $http({
          method: 'GET',
          url: jsonFile
        }).success(function(data) {
          chachiScope.cardSets = data;
          chachiScope.mySet = chachiScope.cardSets[0];
          chachiScope.cards = chachiScope.mySet.cards;
        }).error(function(data, status, headers, config) {
          // Handle the error
          alert("Request for Card data yielded error: " + status);
        });
      };

      $scope.loadedImage = function(card, $imgNum) {
        var rect = document.getElementById("card" + imgNum).getBoundingClientRect();
        console.log("Loaded: Bounding rect for card " + imgNum + " is ( " + rect.width + "," + rect.height + " )");
      }

      // Seems to only work intermittantly   - Need to change for different links
      $scope.rotateImg = function(card, imgNum) {
        //alert("Check rotate for " + card.link);
        var rect = document.getElementById("card" + imgNum).getBoundingClientRect();
        console.log("Rotate: Bounding rect for card " + imgNum + " is ( " + rect.width + "," + rect.height + " )");
        // No rotating
        return "sizeit";
        if (!card.link) {
          return "sizeit";
        }
        var horiz = /=w321-h225/;
        // Rotate landscape
        if (parseInt(rect.width) > parseInt(rect.height)) {
          //	console.log("Rotating");
          return "rotate";
        }
        if (card.link.match(horiz)) {
          return "rotate";
        }
        return "sizeit";

        //		var vert = /=w225-h321/;
        //		if (! card.link.match(vert)) {
        //			return "sizeit";
        //		}

      };
      $scope.selYear = function() {
        $scope.cards = $scope.mySet.cards;
      };

      $scope.pageChk = function(index) {
        var retClass = "noPage";
        if (index) {
          if ((index % 9) == 0) {
            retClass = "page-break";
          }
        }
        return retClass;
      };
      $scope.pageUp = function(cardIndex) {
        return Math.ceil(cardIndex / 9);
      };

      $scope.imageLink = function(card) {
        if (card.link) {
          return card.link
        }
        if (card.fname) {
          return "cards/" + path + "/" + card.fname;
        }
        if (card.id) {
          return "https://drive.google.com/uc?export=view&id=" + card.id;
        }
        return "blah.gif"; // Default if we cannot figure out image link
      };

      $scope.openLightboxModal = function(index) {

        Lightbox.openModal($scope.cards, index);

      };
    }]); // end controller
  })();
