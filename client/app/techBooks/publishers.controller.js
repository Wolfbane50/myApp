'use strict';

(function() {

    angular.module('myappApp')
      .controller('publishersController', ['$scope', '$http', 'Publisher',
        function($scope, $http, Publisher) {
            $scope.addingPub = false;
            $scope.deletePub = function(pub, idx) {
              if (confirm("Are you sure you want to delete this publisher?")) {
            		$scope.publishers.splice(idx, 1);
                Publisher.delete({ name: pub});
            	}
            };
            $scope.newPublisher = function() {
              var newPub = prompt("Name of new item: ");
              if(newPub) {
                $scope.publishers.push(newPub);
                Publisher.create({ name: newPub });
              }
            };
        }]); // end controller
  })();
