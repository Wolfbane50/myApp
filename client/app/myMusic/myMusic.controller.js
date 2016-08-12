'use strict';

(function() {

  angular.module('myappApp')
    .controller('myMusicCtrl', ['$scope', '$http', function($scope, $http) {
      treeCtlScope = $scope;
      $scope.artists = [];
      $scope.musicLocation = "";
      $scope.artistSets = {};

      $http.get('mytunes.json', { cache : true } ).then(function successCb(response) {

         console.log("Got Tunes Data");
         treeCtlScope.artists = response.data.artists;
         treeCtlScope.musicLocation = response.data.baseDir;

         // Walk the artists and sort, create a tree structure
         angular.foreach(treeCtlScope.artists, function(artist) {
           var sortableArt = artist.name.replace(/^\W+/, "");  // Remove any non-alphas from beginning
           sortableArt = sortableArt.replace(/^The /, ""); // Remove leading the
           var letter = sortableArt.subStr(0, 1).toUpperCase();
           if (treeCtlScope.artistSets[letter]) {
               treeCtlScope.artistSets[letter].push(artist);
           } else {
              treeCtlScope.artistSets[letter] = [ artist ];
           }

         });

      }, function errorCb(response) {
      // Handle the error
         alert("Request for mytunes.json yielded error: " + response.status);
      });

      $scope.freshScan = function() {
          alert("Not implemented yet");
      };
      $scope.updateScan = function() {
          alert("Not implemented yet");
      };
      $scope.saveChanges = function() {
          alert("Not implemented yet");
      };

      $scope.toggle = function(scope) {
      };

      $scope.itemIcon = function(scope) {
      };

      $scope.itemSelect = function(scope) {
      };

      $scope.selectedItemClass = function(scope) {
      };

      $scope.myCollapseAll = function(scope) {
      };

      $scope.myExpandAll = function(scope) {
      };


    }]); // end controller
})();
