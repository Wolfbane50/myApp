'use strict';

angular.module('myappApp')
   .directive('dirExplorer', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'dirExplorerCtrl',
       templateUrl: 'app/dirExplorer/dirExplorer.html',
       css: 'app/dirExplorer/dirExplorer.css'
     };
});
