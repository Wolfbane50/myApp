'use strict';

(function() {

  angular.module('myappApp')
    .controller('tagCloudController', ['$scope', '$http',
           function($scope, $http) {
             function getTagThresholds() {
               var sumHits = 0,
                 maxHits = 0;
               angular.forEach($scope.tagCloud, function(tag) {
                 maxHits = (tag.count > maxHits) ? tag.count : maxHits;
               });
               return maxHits;

             }

             $scope.tagFrequencyClass = function(tag) {
               var cssIncr;
               if (tag.count == 1) {
                 cssIncr = 1;
               } else {
                 var cssIncr = Math.ceil((Math.log(tag.count) / Math.log($scope.tagMaxHits)) * 4);
               }
               //console.log("Tag: " + tag.name + " Count: " + tag.count + " Offset = " + cssIncr + ", maxHits = " + $scope.tagMaxHits);
               return "tagCss" + cssIncr;
             };

             console.log("In tagCloud Controller, about to get tagCloud");
             $http({
               method: 'GET',
//               url: 'http://localhost:3000/documents/tag_cloud',
               url: '/api/books/tag_cloud',
               headers: {
                 'Accept': 'application/json'
               }
             }).then(function successCallback(response) {
               //alert("Got tag cloud");
               console.log("Got " + response.data);
               $scope.tagCloud = response.data;
               $scope.tagMaxHits = getTagThresholds();
             }, function errorCallback(response) {
               alert("Request for Tag Cloud yielded error: " + response.status);
             });


       }]); // end controller
   })();
