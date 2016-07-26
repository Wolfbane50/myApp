'use strict';

angular.module('myappApp')
   .directive('c2tree', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'c2Ctrl',
       templateUrl: 'app/c2tree/c2tree.html'
     };
});
