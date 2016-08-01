'use strict';

angular.module('myappApp')
   .directive('carddirs', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'carddirsCtrl',
       templateUrl: 'app/cardCommon/carddirs.html',
       css: 'app/cardCommon/carddirs.css'
     };
});
