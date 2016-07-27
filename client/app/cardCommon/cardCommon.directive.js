'use strict';

angular.module('myappApp')
   .directive('cards', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'cardCtrl',
       templateUrl: 'app/cardCommon/cardCommon.html'
     };
});
