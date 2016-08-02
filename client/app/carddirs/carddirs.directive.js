'use strict';

angular.module('myappApp')
   .directive('carddirs', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'carddirsCtrl',
       templateUrl: 'app/carddirs/carddirs.html',
       css: 'app/carddirs/carddirs.css'
     };
});
