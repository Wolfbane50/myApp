'use strict';

(function() {

  angular.module('myappApp')
    .controller('flexboxPlayCtrl', ['$scope', 'subappNavbar', 'subappNav', function($scope, subappNavbar, subappNav) {
       console.log("In flexboxPlay controller..");
       $scope.isSideOpen = false;

       $scope.toggleSide = function() {
         $scope.isSideOpen = !($scope.isSideOpen);
         console.log("Toggling Side Open to " + $scope.isSideOpen);
       };

       $scope.cb1 = function() {
         alert("Callback One");
       };
       $scope.cb2 = function() {
         alert("Callback Two");
       };
    }]); // end controller
})();
