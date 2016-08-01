'use strict';

angular.module('myappApp')
   .directive('spsdb', function() {
     return {
       restrict: "E",
       replace: true,
       scope: true,
       controller: 'spsdbCtrl',
       templateUrl: 'app/spsdb/spsdb.html',
       css: 'app/dirExplorer/spsdb.css'
     };
});
