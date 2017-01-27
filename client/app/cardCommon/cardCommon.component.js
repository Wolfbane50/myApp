'use strict';

(function() {

  angular.module('myappApp')
    .config(function(LightboxProvider) {
      LightboxProvider.getImageUrl = function(card) {
        if (card.link) {
          return card.link
        }
        if (card.fname) {
          var path = card.path ? (card.path + "/") : "";

          return "http://192.168.1.151/cards/" + path + card.fname;
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

    class CardCommonComponent {
      constructor($http, $scope, $uibModal, Lightbox) {
        this.bar = "rootBar";
        this.myJSON = "chachis3.json";
        this.jsonFiles = ['chachis3.json', 'bunt.json', 'ss_cards.json'];
        this.cardSets = [];
        this.mySet = "";
        this.cards = [];

        this.$scope = $scope;
        this.$http = $http;
        this.Lightbox = Lightbox;
        this.$uibModal = $uibModal;

        this.loadSets = function() {
          var jsonFile = this.myJSON;
          this.$http.get(jsonFile, {
            cache: true
          }).then(response => {
            this.cardSets = response.data;
            this.mySet = this.cardSets[0];
            this.cards = this.mySet.cards;
          }, function errorCallback(response) {
            // Handle the error
            alert("Request for Card data (" + this.myJSON  +  ") yielded error: " + response.status);
          });
        };

        this.loadedImage = function(card, imgNum) {
          var rect = document.getElementById("card" + imgNum).getBoundingClientRect();
          console.log("Loaded: Bounding rect for card " + imgNum + " is ( " + rect.width + "," + rect.height + " )");
        }

        // Seems to only work intermittantly   - Need to change for different links
        this.rotateImg = function(card, imgNum) {
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
        this.selYear = function() {
          this.cards = this.mySet.cards;
        };

        this.pageChk = function(index) {
          var retClass = "noPage";
          if (index) {
            if ((index % 9) == 0) {
              retClass = "page-break";
            }
          }
          return retClass;
        };
        this.pageUp = function(cardIndex) {
          return Math.ceil(cardIndex / 9);
        };

        this.imageLink = function(card) {
          if (!card) {
            console.log("Card not existing in imageLink");
          }
          if (card.link) {
            return card.link
          }
          if (card.fname) {
            var path = card.path ? (card.path + "/") : "";

            return "http://192.168.1.151/cards/" + path + card.fname;
          }
          if (card.id) {
            return "https://drive.google.com/uc?export=view&id=" + card.id;
          }
          return "blah.gif"; // Default if we cannot figure out image link
        };

        this.openLightboxModal = function(index) {

          this.Lightbox.openModal(this.cards, index);

        };



        this.updateJson = function() {
          function postIt (url) {
            this.$http.post(url, {
              cache: true
            }).then(response => {
              this.cardSets = response.data;
              this.mySet = this.cardSets[0];
              this.cards = this.mySet.cards;
            }, function errorCallback(response) {
              // Handle the error
              alert("Request to update Card data (" + this.myJSON  +  ") yielded error: " + response.status);
            });
          }

          var jsonFile = this.myJSON;
          if (jsonFile == "chachis3.json") {
            postIt("/api/newCards/chachi");
          } else {
            if (jsonFile == "bunt.json") {
              postIt("/api/newCards/bunt");
            } else {
              if (jsonFile == "ss_cards.json") {
                postIt("/api/newCards");
              } else {
                alert("No update function implemented for this yet!");
              }
            }
          }
        };


      } // end component class

      $onInit() {
        this.loadSets();
      }  // end onInit
   }

   angular.module('myappApp')
     .component('cardCommonComponent', {
       templateUrl: 'app/cardCommon/cardCommon.html',
       controller: CardCommonComponent
     });

})();
