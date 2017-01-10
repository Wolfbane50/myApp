'use strict';

(function() {

  angular.module('myappApp')
    .controller('flexboxPlayCtrl', ['$scope', function($scope) {
       console.log("In flexboxPlay controller..");
       $scope.isSideOpen = false;

       $scope.toggleSide = function() {
         $scope.isSideOpen = !($scope.isSideOpen);
         console.log("Toggling Side Open to " + $scope.isSideOpen);
       }
    }]); // end controller
})();
