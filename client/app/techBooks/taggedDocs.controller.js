'use strict';

(function() {

    angular.module('myappApp')
      .controller('taggedDocsController', ['$scope', '$http', '$stateParams',
        function($scope, $http, $stateParams) {
          console.log("In taggedDocsController");
          $scope.tagDocs = [];
          $scope.selectedTag = $stateParams.tag;

          // go get the tagged documents
          $http({
            method: 'GET',
            url: 'http://localhost:3000/documents/tag',
            params: { id: $scope.selectedTag },
            headers: {
              'Accept': 'application/json'
            }
          }).then(function successCallback(response) {
            //alert("Got tag cloud");
            $scope.tagDocs = response.data;
          }, function errorCallback(response) {
            alert("Request for Tagged Documents yielded error: " + response.status);
          });

        }]); // end controller
  })();
