'use strict';

(function() {

  angular.module('myappApp')
    .controller('gdriveIdTableCtrl', ['$scope', '$http',
      function($scope, $http) {
        var drvScope = $scope;

        // Make HTTP request to get ID's

        $http.get('/api/newCards/drive').then(function successCb(response) {

          console.log("Got GDrive Data");
          drvScope.items = response.data;
        }, function errorCb(response) {
          // Handle the error
          alert("Request for /api/newCards/drive yielded error: " + response.status);
        });

      }
    ]); // end controller
})();
